import ArrayFn from '../utilities/ArrayFn.js';
import MathFn from '../utilities/MathFn.js';

const NUMBER_OF_CANDLESTICKS_A_YEAR = 252; // To calculate standard deviation
export default function CandlestickCollection() {
    this.__collection = [];
    this.__volumeProfile = new Map();
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
            .slice(this.length() - NUMBER_OF_CANDLESTICKS_A_YEAR);

        const standardDeviation = MathFn
            .standardDeviation(oneYearCollection
                .map(candlestick => {
                    // console.log(candlestick.getCloseDiff());
                    return candlestick.getCloseDiff();
                })
            );

        candlestick.setStandardDeviation(standardDeviation);
    }

    // update volume profile
    this.updateVolumeProfile(candlestick);

    this.__collection.push(candlestick);
    return this;
}

CandlestickCollection.prototype.updateVolumeProfile = function (candlestick) {
    let priceLevels = new Map();
    for (let price = candlestick.getLow(); price <= candlestick.getHigh(); price = MathFn.precision(price + 0.00001)) {
        priceLevels.set(`${price}`, 0);
    }

    const averageVolumePerPriceLevel = candlestick.getVolume() / priceLevels.size;

    priceLevels.forEach((volume, price) => {
        this.__volumeProfile.set(
            `${price}`,
            this.__volumeProfile.has(`${price}`)
                ? this.__volumeProfile.get(`${price}`) + averageVolumePerPriceLevel
                : averageVolumePerPriceLevel,
        );
    });

    return this;
}

CandlestickCollection.prototype.getVolumeProfile = function (price) {
    return this
        .__volumeProfile
        .get(`${price}`);
}

CandlestickCollection.prototype.getLastCandlestick = function () {
    return ArrayFn.getLastElement(this.__collection);
}

CandlestickCollection.prototype.hasCandlesticksMoreThanOneYear = function () {
    return this.length() > NUMBER_OF_CANDLESTICKS_A_YEAR;
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

CandlestickCollection.prototype.length = function () {
    return this
        .__collection
        .length;
}

CandlestickCollection.prototype.getByIndex = function(index) {
    return this.__collection[index];
}

CandlestickCollection.prototype.setAllVolumeProfile = function () {
    for (let i = 0; i < this.length(); i++) {
        const candlestick = this.getByIndex(i);

        candlestick
            .setVolumeProfile(this
                .getVolumeProfile(candlestick.getClose()));

        if (i > 0) {
            const previousCandlestickVolumeProfile = this
                .getByIndex(i - 1)
                .getVolumeProfile();

            candlestick
                .setVolumeProfileDiff(Math
                    .log(candlestick.getVolumeProfile() / previousCandlestickVolumeProfile));
        }
    }

    return this;
}