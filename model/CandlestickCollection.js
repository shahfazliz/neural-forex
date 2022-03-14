import ArrayFn from '../utilities/ArrayFn.js';
import MathFn from '../utilities/MathFn.js';

const NUMBER_OF_CANDLESTICKS_A_YEAR = 252; // To calculate standard deviation
export default function CandlestickCollection() {
    this.__collection = [];
}

CandlestickCollection.prototype.push = function(candlestick) {
    // calculate diff
    if (!ArrayFn.isEmpty(this.__collection)) {
        const previousCandlestick = this.getLastCandlestick();
        const previousCandlestickClose = previousCandlestick.getClose();
        const previousCandlestickVolume = previousCandlestick.getVolume();

        candlestick
            .setOpenDiff(Math.log(candlestick.getOpen() / previousCandlestickClose))
            .setCloseDiff(Math.log(candlestick.getClose() / previousCandlestickClose))
            .setHighDiff(Math.log(candlestick.getHigh() / previousCandlestickClose))
            .setLowDiff(Math.log(candlestick.getLow() / previousCandlestickClose))
            .setVolumeDiff(Math.log(candlestick.getVolume() / previousCandlestickVolume));
    }

    // calculate standard deviation
    if (this.hasCandlesticksMoreThanOneYear()) {
        const oneYearCollection = this
            .__collection
            .slice(this.__collection.length - this.__numberOfCandlesAYear);

        candlestick
            .setStandardDeviation(MathFn
                .standardDeviation(oneYearCollection
                    .map(candlestickOfYear => {
                        // console.log(candlestickOfYear.getCloseDiff());
                        return candlestickOfYear.getCloseDiff();
                    })
                )
            );
    }

    this.__collection.push(candlestick);
    return this;
}

CandlestickCollection.prototype.updateVolumeProfile = function () {
    return this;
}

CandlestickCollection.prototype.getLastCandlestick = function () {
    return ArrayFn.getLastElement(this.__collection);
}

CandlestickCollection.prototype.hasCandlesticksMoreThanOneYear = function () {
    return this.__collection.length > NUMBER_OF_CANDLESTICKS_A_YEAR;
}
