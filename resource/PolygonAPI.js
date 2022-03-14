import Candlestick from '../model/Candlestick.js';
import CandlestickCollection from '../model/CandlestickCollection.js';
import HTTPAdaptor from '../utilities/HTTPAdaptor.js';

export default function PolygonAPI() {
    
}

PolygonAPI.prototype.getDailyCandlestickCollection = function({
    startDate,
    endDate,
    symbol
}) {
    return HTTPAdaptor
        .get(
            `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${startDate}/${endDate}`,
            {
                headers: {
                    Authorization: process.env.POLYGON_API,
                },
            }
        )
        .then(response => {
            return response
                .data
                .results;
        })
        .then(results => {
            const candlestickCollection = new CandlestickCollection();

            results.forEach(result => {
                candlestickCollection.push(new Candlestick({
                    close: result.c,
                    high: result.h,
                    low: result.l,
                    open: result.o,
                    timestamp: result.t,
                    volume: result.v,
                }));
            });

            return candlestickCollection;
        });
};
