import App from '../app.js';
import ArrayFn from '../utilities/ArrayFn.js';
import CollectionService from '../resource/CollectionService.js';
import MathFn from '../utilities/MathFn.js';

const app = new App();
export default function CandlestickCollection(symbol) {
    this.__symbol = symbol;
    this.__collection = [];
    this.__volumeProfile = new Map();
}

CandlestickCollection.prototype.initVolumeProfile = function () {
    return CollectionService
        .readJSONFileAsVolumeProfile(this.__symbol)
        .then(volumeProfileMap => this.__volumeProfile = volumeProfileMap);
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
            .slice(this.length() - app.getNumberOfCandlesticksAYear());

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

CandlestickCollection.prototype.updateVolumeProfile = function (candlestick) {
    const priceLevels = (candlestick.getHigh() - candlestick.getLow()) * 10000 + 1; // limit 4 decimal places
    const averageVolumePerPriceLevel = candlestick.getVolume() / priceLevels;

    for (let price = candlestick.getLow(); price <= candlestick.getHigh(); price = MathFn.precision(price + 0.0001)) {
        this.__volumeProfile.set(
            `${price}`,
            this.__volumeProfile.has(`${price}`)
                ? this.__volumeProfile.get(`${price}`) + averageVolumePerPriceLevel
                : averageVolumePerPriceLevel,
        );
    }

    return this;
}

CandlestickCollection.prototype.getVolumeProfileMap = function () {
    return this.__volumeProfile;
}

CandlestickCollection.prototype.getVolumeProfileMapAt = function(price) {
    return this
        .__volumeProfile
        .get(`${price}`);
}

CandlestickCollection.prototype.getLastCandlestick = function () {
    return ArrayFn.getLastElement(this.__collection);
}

CandlestickCollection.prototype.hasCandlesticksMoreThanOneYear = function () {
    return this.length() > app.getNumberOfCandlesticksAYear();
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

CandlestickCollection.prototype.resetAllVolumeProfile = function () {
    for (let i = 0; i < this.length(); i++) {
        const candlestick = this.getByIndex(i);

        candlestick
            .setVolumeProfile(this
                .getVolumeProfileMapAt(candlestick.getClose()));

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

CandlestickCollection.prototype.map = function(callback) {
    return this
        .__collection
        .map(callback);
}

CandlestickCollection.prototype.deleteIndex = function(index) {
    this
        .__collection
        .splice(index, 1);
    return this;
}
