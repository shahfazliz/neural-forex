import ArrayFn from '../utilities/ArrayFn.js';
import MathFn from '../utilities/MathFn.js';

const NUMBER_OF_CANDLESTICKS_A_YEAR = 252; // To calculate standard deviation
export default function CandlestickCollection() {
    this.__collection = [];
}

CandlestickCollection.prototype.push = function(candlestick) {
    // calculate diff
    if (!this.isEmpty()) {
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
            .slice(this.__collection.length - NUMBER_OF_CANDLESTICKS_A_YEAR);

        const standardDeviation = MathFn
            .standardDeviation(oneYearCollection
                .map(candlestick => {
                    // console.log(candlestick.getCloseDiff());
                    return candlestick.getCloseDiff();
                })
            );

        candlestick.setStandardDeviation(standardDeviation);
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

CandlestickCollection.prototype.isEmpty = function () {
    return ArrayFn.isEmpty(this.__collection);
}

CandlestickCollection.prototype.forEach = function(callback) {
    return this
        .__collection
        .forEach(callback);
}

CandlestickCollection.prototype.toString = function () {
    return JSON.stringify(
        this
            .__collection
            .map(candlestick => candlestick.raw()),
        undefined,
        4
    );
}