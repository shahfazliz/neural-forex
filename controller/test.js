import CollectionService from '../resource/CollectionService.js';
// import PolygonAPI from '../resource/PolygonAPI.js';

// const test = new PolygonAPI();
// test
//     .getDailyCandlestickCollection({
//         startDate: '2022-03-07',
//         endDate: '2022-03-11',
//         symbol: 'EURUSD',
//     })
//     .then(candlestickCollection => console.log(candlestickCollection.__collection));

CollectionService
    .readJSONFileAsCandlestickCollection('EURUSD')
    .then(candlestickCollection => {
        candlestickCollection.forEach(candle => {
            console.log(candle);
        })
    })