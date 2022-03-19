import Candlestick from '../model/Candlestick.js';
import CandlestickCollection from '../model/CandlestickCollection.js';
import FileService from './FileService.js';

export default {
    readJSONFileAsCandlestickCollection,
    readJSONFileAsVolumeProfile,
    writeCandlestickCollectionIntoJSONFile,
    writeForexWorldIntoJSONFile,
    writeVolumeProfileMapIntoJSONFile,
}

function readJSONFileAsCandlestickCollection(symbol) {
    return FileService
        .readJSONFile(`./data/symbols/${symbol}.json`)
        .then(rawCandlestickCollection => {
            const candlestickCollection = new CandlestickCollection(symbol);
            candlestickCollection.initVolumeProfile();
            
            rawCandlestickCollection.forEach(rawCandlestick => {
                candlestickCollection.push(new Candlestick(rawCandlestick));
            });

            return candlestickCollection;
        })
}

function writeCandlestickCollectionIntoJSONFile({
    data,
    symbol,
}) {
    return FileService
        .writeJSONFile({
            data,
            jsonfilepath: `./data/symbols/${symbol}.json`,
        })
}

function readJSONFileAsVolumeProfile(symbol) {
    return FileService
        .readJSONFile(`./data/volumeProfile/${symbol}.json`)
        .then(rawVolumeProfile => {
            const volumeProfileMap = new Map();
            Object
                .keys(rawVolumeProfile)
                .forEach(price => {
                    volumeProfileMap.set(`${price}`, rawVolumeProfile[`${price}`]);
                });
            return volumeProfileMap;
        });
}

function writeVolumeProfileMapIntoJSONFile({
    data,
    symbol,
}) {
    return FileService
        .writeJSONFile({
            data: Object.fromEntries(data),
            jsonfilepath: `./data/volumeProfile/${symbol}.json`,
        });
}

function writeForexWorldIntoJSONFile({
    data
}) {
    return FileService
        .writeJSONFile({
            data,
            jsonfilepath: `./data/world/forex.json`,
        });
}
