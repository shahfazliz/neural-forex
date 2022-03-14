export default function App() {
    this.__listOfCurrencies = [
        'EURUSD',
        'USDJPY',
    ];
}

App.prototype.getCurrencies = function () {
    return this.__listOfCurrencies;
}
