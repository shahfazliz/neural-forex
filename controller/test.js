import PolygonAPI from '../resource/PolygonAPI.js';

const test = new PolygonAPI();
test
    .getDailyData({
        startDate: '2021-07-22',
        endDate: '2022-10-02',
        symbol: 'C:EURUSD',
    })
    .then(data => console.log(data));