import CollectionService from '../resource/CollectionService.js';
import DateTimeAdaptor from '../utilities/DateTimeAdaptor.js';
import PolygonAPI from '../resource/PolygonAPI.js';

updateData('EURUSD');

const api = new PolygonAPI();

function updateData(symbol) {
    // open file
    return CollectionService
        .readJSONFileAsCandlestickCollection(symbol)
        .then(candlestickCollection => {
            // get start date and end date
            const startDate = candlestickCollection.isEmpty()
                ? new DateTimeAdaptor('2022-03-01')
                : candlestickCollection
                    .getLastCandlestick()
                    .getTimestamp()
                    .addBusinessDay(1);
                    
            const endDate = new DateTimeAdaptor().subtractBusinessDay(1);
            
            // get data from to last working day from today
            return api
                .getDailyCandlestickCollection({
                    startDate: startDate.format(),
                    endDate: endDate.format(),
                    symbol,
                })
                // save into collection
                .then(newCandlestickCollection => {
                    newCandlestickCollection.forEach(candlestick => {
                        candlestickCollection.push(candlestick)
                    });

                    return candlestickCollection;
                })
                // update volume profile
                // save into collection into file
                .then(candlestickCollection => {
                    return CollectionService.writeCandlestickCollectionIntoJSONFile({
                        symbol,
                        data: candlestickCollection.toString(),
                    });
                });
        });
}
