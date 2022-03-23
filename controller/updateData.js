import App from '../app.js';
import CollectionService from '../resource/CollectionService.js';
import DateTimeAdaptor from '../utilities/DateTimeAdaptor.js';
import PolygonAPI from '../resource/PolygonAPI.js';

const api = new PolygonAPI();
const API_START_DATE = '2020-03-25';
const app = new App();

Promise
    .all(app
        .getCurrencies()
        .map(symbol => updateData(symbol).then(candlestickCollection => {
            return candlestickCollection.map(candlestick => {
                const map = new Map();

                map.set(`Day`, candlestick.getDay() / 100); // Need days to know Mon, Wed, Fri trading days
                map.set(`Month`, candlestick.getMonth() / 100); // Need month to know when to withdraw
                map.set(`${symbol}_Open`, candlestick.getOpenDiff());
                map.set(`${symbol}_Close`, candlestick.getCloseDiff());
                map.set(`${symbol}_Volume`, candlestick.getVolumeDiff());
                map.set(`${symbol}_High`, candlestick.getHighDiff());
                map.set(`${symbol}_Low`, candlestick.getLowDiff());
                map.set(`${symbol}_VolumeProfile`, candlestick.getVolumeProfileDiff());
                map.set(`${symbol}_StandardDeviation`, candlestick.getStandardDeviation());

                return map;
            })
        }))
    )
    // Create forex world
    .then(multipleCandlestickMap => {
        return new Promise((resolve, reject) => {
            console.log(`Combine candlestick maps to a forex world`);
            let result = [];
            const totalMapsPerSymbol = multipleCandlestickMap[0].length;
        
            // Check if all worlds have same amount of candles
            for (let i = 0; i < multipleCandlestickMap.length; i++) {
                if (multipleCandlestickMap[i].length !== totalMapsPerSymbol) {
                    const firstSymbol = extractSymbolFromString([...multipleCandlestickMap[0][0].keys()][2]);
                    const secondSymbol = extractSymbolFromString([...multipleCandlestickMap[i][0].keys()][2]);
                    
                    reject(`Maps does not have the same amount of candles ${firstSymbol}(${totalMapsPerSymbol}) vs. ${secondSymbol}(${multipleCandlestickMap[i].length})`);
                }
            }

            // Combine all multipe candlestick map into single map then put into result array
            for (let originalMapIndex = 0; originalMapIndex < totalMapsPerSymbol; originalMapIndex++) {
                let map = new Map();

                for (let index = 0; index < multipleCandlestickMap.length; index++) {
                    let entry = multipleCandlestickMap[index][originalMapIndex].entries();
                    let value = entry.next().value;

                    // Copy to new map
                    while (value !== undefined) {
                        map.set(...value);
                        value = entry.next().value;
                    }

                    // Delete the old map to save memory space
                    multipleCandlestickMap[index][originalMapIndex].clear();
                }
                result.push(map);
            }

            resolve(result);
        });
    })
    .then(forexWorld => {
        return CollectionService.writeForexWorldIntoJSONFile({
            // Convert map into json object
            data: forexWorld.map(mapEntry => Object.fromEntries(mapEntry)),
        });
    });

function updateData(symbol) {
    // open file
    return CollectionService
        .readJSONFileAsCandlestickCollection(symbol)
        .then(candlestickCollection => {
            console.log(`${symbol} loaded into memory`);

            // get start date and end date
            const startDate = candlestickCollection.isEmpty()
                ? new DateTimeAdaptor(API_START_DATE)
                : candlestickCollection
                    .getLastCandlestick()
                    .getTimestamp()
                    .addBusinessDay(1);
                    
            const endDate = new DateTimeAdaptor().subtractBusinessDay(1);

            // Validate startDate and endDate
            if (startDate.isAfter(endDate)) {
                return candlestickCollection;
            }
            
            // Get data from to last working day from today
            return api
                .getDailyCandlestickCollection({
                    startDate: startDate.format(),
                    endDate: endDate.format(),
                    symbol,
                })
                // Update volume profile & save into collection
                .then(newCandlestickCollection => {
                    console.log(`${symbol} update volume profile and candlestickCollection`);
                    newCandlestickCollection.forEach(candlestick => {
                        candlestickCollection
                            .push(candlestick)
                            .updateVolumeProfile(candlestick);
                    });
                    return candlestickCollection;
                })
                // Reset volume profile
                .then(candlestickCollection => {
                    console.log(`${symbol} reset volume profile`);
                    return candlestickCollection.resetAllVolumeProfile();
                })
                // Save candlestick collection into file
                .then(candlestickCollection => {
                    return CollectionService.writeCandlestickCollectionIntoJSONFile({
                        symbol,
                        data: candlestickCollection.toString(),
                    });
                })
                // Save volume profile into file
                .then(() => {
                    return CollectionService.writeVolumeProfileMapIntoJSONFile({
                        data: candlestickCollection.getVolumeProfileMap(),
                        symbol,
                    });
                })
                // Return the final and updated candlestick collection
                .then(() => {
                    return candlestickCollection;
                });
        });
}

function extractSymbolFromString(str) {
    return str.match(/^.{6}/)[0];
}