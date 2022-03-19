export default function App() {
    this.__listOfCurrencies = [
        'EURUSD',
        'USDJPY',
        'GBPJPY',
    ];

    this.__numberOfCandles = 50;
    this.__numberOfCandlesticksAYear = 252; // To calculate standard deviation, create dataset
}

App.prototype.getCurrencies = function () {
    return this.__listOfCurrencies;
}

App.prototype.getNumberOfCandles = function () {
    return this.__numberOfCandles;
}

App.prototype.getNumberOfCandlesticksAYear = function () {
    return this.__numberOfCandlesticksAYear;
}
