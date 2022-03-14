import ArrayFn from '../utilities/ArrayFn.js';
import MathFn from '../utilities/MathFn.js';

export default class CandlestickCollection {
    __collection = [];
    __numberOfCandlesAYear = 252; // To calculate standard deviation

    push(candlestick) {
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

    updateVolumeProfile() {
        return this;
    }

    getLastCandlestick() {
        return ArrayFn.getLastElement(this.__collection);
    }

    hasCandlesticksMoreThanOneYear() {
        return this.__collection.length > this.__numberOfCandlesAYear;
    }
}