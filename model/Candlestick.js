export default function Candlestick({
    close,
    high,
    low,
    open,
    timestamp,
    volume,
}) {
    this.__standardDeviation = 'N/A';

    this.__closeDiff = 'N/A';
    this.__highDiff = 'N/A';
    this.__lowDiff = 'N/A';
    this.__openDiff = 'N/A';
    this.__volumeDiff = 'N/A';

    this.__volumeProfile = 'N/A';
    this.__volumeProfileDiff = 'N/A';

    this.__close = close;
    this.__high = high;
    this.__low = low;
    this.__open = open;
    this.__timestamp = timestamp;
    this.__volume = volume;
}

Candlestick.prototype.setStandardDeviation = function(value) {
    this.__standardDeviation = value;
    return this;
}

Candlestick.prototype.getClose = function () {
    return this.__close
}

Candlestick.prototype.getHigh = function () {
    return this.__high;
}

Candlestick.prototype.getLow = function () {
    return this.__low;
}

Candlestick.prototype.getOpen = function () {
    return this.__open;
}

Candlestick.prototype.getTimestamp = function () {
    return this.__timestamp;
}

Candlestick.prototype.getVolume = function () {
    return this.__volume;
}

Candlestick.prototype.getStandardDeviation = function () {
    return this.__standardDeviation;
}

Candlestick.prototype.setCloseDiff = function(value) {
    this.__closeDiff = value;
    return this;
}

Candlestick.prototype.setHighDiff = function(value) {
    this.__highDiff = value;
    return this;
}

Candlestick.prototype.setLowDiff = function(value) {
    this.__lowDiff = value;
    return this;
}

Candlestick.prototype.setOpenDiff = function(value) {
    this.__openDiff = value;
    return this;
}

Candlestick.prototype.setVolumeDiff = function(value) {
    this.__volumeDiff = value;
    return this;
}

Candlestick.prototype.getCloseDiff = function () {
    return this.__closeDiff;
}

Candlestick.prototype.getHighDiff = function () {
    return this.__highDiff;
}

Candlestick.prototype.getLowDiff = function () {
    return this.__lowDiff;
}

Candlestick.prototype.getOpenDiff = function () {
    return this.__openDiff;
}

Candlestick.prototype.getVolumeDiff = function () {
    return this.__volumeDiff;
}
