export default function App() {
    this.__listOfCurrencies = [
        'EURUSD',
        'USDJPY',
        'GBPJPY',
    ];
}

App.prototype.getCurrencies = function () {
    return this.__listOfCurrencies;
}
