export default function App() {
    this.__listOfCurrencies = [
        'AUDCAD',
        'AUDJPY',
        'CHFJPY',
        'EURAUD',
        'EURCAD',
        'EURGBP',
        'EURUSD',
        'GBPCHF',
        'GBPJPY',
        'GBPUSD',
        'USDCAD',
        'USDJPY',
        
        // Inconsistent number of candles
        // 'AUDNZD',
        // 'AUDUSD',
        // 'EURCHF',
        // 'EURJPY',
        // 'NZDUSD',
        // 'USDCHF',
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
