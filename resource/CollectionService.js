import Candlestick from '../model/Candlestick.js';
import CandlestickCollection from '../model/CandlestickCollection.js';
import FileService from './FileService.js';

export default {
    readJSONFileAsCandlestickCollection,
    writeCandlestickCollectionIntoJSONFile,
}

function readJSONFileAsCandlestickCollection(symbol) {
    return FileService
        .readJSONFile(`./data/symbols/${symbol}.json`)
        .then(rawCandlestickCollection => {
            const candlestickCollection = new CandlestickCollection();
            
            rawCandlestickCollection.forEach(rawCandlestick => {
                candlestickCollection.push(new Candlestick(rawCandlestick));
            });

            return candlestickCollection.setAllVolumeProfile();
        })
}

function writeCandlestickCollectionIntoJSONFile({
    symbol,
    data,
}) {
    return FileService
        .writeJSONFile({
            data,
            jsonfilepath: `./data/symbols/${symbol}.json`,
        })
}