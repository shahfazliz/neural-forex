export default class Candlestick {
    __closeDiff = 'N/A';
    __highDiff = 'N/A';
    __lowDiff = 'N/A';
    __openDiff = 'N/A';
    __volumeDiff = 'N/A';

    __volumeProfile = 'N/A';
    __volumeProfileDiff = 'N/A';

    constructor({
        close,
        high,
        low,
        open,
        timestamp,
        volume,
    }) {
        this.__close = close;
        this.__high = high;
        this.__low = low;
        this.__open = open;
        this.__timestamp = timestamp;
        this.__volume = volume;
    }

    setStandardDeviation(value) {
        this._standardDeviation = value;
        return this;
    }

    getClose = () => this.__close;
    getHigh = () => this.__high;
    getLow = () => this.__low;
    getOpen = () => this.__open;
    getTimestamp = () => this.__timestamp;
    getVolume = () => this.__volume;
    getStandardDeviation = () => this.__standardDeviation;

    setCloseDiff(value) {
        this.__closeDiff = value;
        return this;
    }

    setHighDiff(value) {
        this.__highDiff = value;
        return this;
    }

    setLowDiff(value) {
        this.__lowDiff = value;
        return this;
    }

    setOpenDiff(value) {
        this.__openDiff = value;
        return this;
    }

    setVolumeDiff(value) {
        this.__volumeDiff = value;
        return this;
    }


    getCloseDiff = () => this.__closeDiff;
    getHighDiff = () => this.__highDiff;
    getLowDiff = () => this.__lowDiff;
    getOpenDiff = () => this.__openDiff;
    getVolumeDiff = () => this.__volumeDiff;
}
