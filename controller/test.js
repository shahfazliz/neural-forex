import PolygonAPI from '../resource/PolygonAPI.js';

const test = new PolygonAPI();
test
    .getDailyCandlestickCollection({
        startDate: '2022-03-07',
        endDate: '2022-03-11',
        symbol: 'C:EURUSD',
    })
    .then(candlestickCollection => console.log(candlestickCollection.__collection));