export default function App() {
    this.__listOfCurrencies = [
        'AUDCAD',
        'AUDJPY',
        'AUDNZD',
        'AUDUSD',
        'CHFJPY',
        'EURAUD',
        'EURCAD',
        'EURCHF',
        'EURGBP',
        'EURJPY',
        'EURUSD',
        'GBPCHF',
        'GBPJPY',
        'GBPUSD',
        'NZDUSD',
        'USDCAD',
        'USDCHF',
        'USDJPY',
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
