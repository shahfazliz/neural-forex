import App from '../app.js';
import CollectionService from '../resource/CollectionService.js';
import DateTimeAdaptor from '../utilities/DateTimeAdaptor.js';
import PolygonAPI from '../resource/PolygonAPI.js';

const api = new PolygonAPI();
const API_START_DATE = '2020-03-15';
const app = new App();

Promise.all(app
    .getCurrencies()
    .map(symbol => updateData(symbol))
);

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
            
            // get data from to last working day from today
            return startDate.isSameOrBefore(endDate) 
                && api
                    .getDailyCandlestickCollection({
                        startDate: startDate.format(),
                        endDate: endDate.format(),
                        symbol,
                    })
                    // update volume profile & save into collection
                    .then(newCandlestickCollection => {
                        newCandlestickCollection.forEach(candlestick => {
                            candlestickCollection
                                .push(candlestick)
                                .updateVolumeProfile(candlestick);
                        });
                        console.log(`${symbol} update volume profile and candlestickCollection`);
                        return candlestickCollection;
                    })
                    // reset volume profile
                    .then(candlestickCollection => {
                        console.log(`${symbol} reset volume profile`);
                        return candlestickCollection.resetAllVolumeProfile();
                    })
                    // save into collection into file
                    .then(candlestickCollection => {
                        return CollectionService.writeCandlestickCollectionIntoJSONFile({
                            symbol,
                            data: candlestickCollection.toString(),
                        });
                    })
                    // save volume profile into file
                    .then(() => {
                        return CollectionService.writeVolumeProfileMapIntoJSONFile({
                            data: candlestickCollection.getVolumeProfileMap(),
                            symbol,
                        })
                    });
        });
}
