import HTTPAdaptor from '../utilities/HTTPAdaptor.js';

const http = new HTTPAdaptor();

export default class PolygonAPI {
    getDailyData({
        startDate,
        endDate,
        symbol
    }) {
        return http
            .get(
                `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${startDate}/${endDate}`,
                {
                    headers: {
                        Authorization: process.env.POLYGON_API,
                    }
                }
            )
            .then(response => response.data);
    }
}
