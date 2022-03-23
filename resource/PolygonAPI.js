import Candlestick from '../model/Candlestick.js';
import CandlestickCollection from '../model/CandlestickCollection.js';
import HTTPAdaptor from '../utilities/HTTPAdaptor.js';
import MathFn from '../utilities/MathFn.js';

export default function PolygonAPI() {
    
}

PolygonAPI.prototype.getDailyCandlestickCollection = function({
    startDate,
    endDate,
    symbol
}) {
    console.log(`Retrieving data for ${symbol} from ${startDate} to ${endDate}`);
    return HTTPAdaptor
        .get(
            `https://api.polygon.io/v2/aggs/ticker/C:${symbol}/range/1/day/${startDate}/${endDate}`,
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
            const candlestickCollection = new CandlestickCollection(symbol);

            results.forEach(result => {
                const candlestick = new Candlestick({
                    close: MathFn.precision(result.c),
                    high: MathFn.precision(result.h),
                    low: MathFn.precision(result.l),
                    open: MathFn.precision(result.o),
                    timestamp: result.t,
                    volume: result.v,
                });

                // Delete Sundays and Saturday data
                if (candlestick.getDay() !== 0 && candlestick.getDay() !== 6) {
                    candlestickCollection.push(candlestick);
                }
            });

            return candlestickCollection;
        });
};
