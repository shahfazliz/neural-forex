import fs from 'fs/promises';

export default {
    readJSONFile,
    writeJSONFile,
}

/**
 * Read from json file as object
 */
function readJSONFile(jsonfilepath) {
    return fs
        .readFile(jsonfilepath)
        .then(rawJson => {
            console.log(`Reading from ${jsonfilepath}`);
            return JSON.parse(rawJson);
        })
        // If file does not exist, create one
        .catch(() => {
            console.log(`File not exist, creating ${jsonfilepath}`);
            return this
            .writeJSONFile({
                jsonfilepath,
                data: [],
            })
            .then(data => data);
        });
}

/**
 * Write json file
 * @returns {Promise}
 */
function writeJSONFile({
    jsonfilepath,
    data = [],
}) {
    return fs
        .writeFile(
            jsonfilepath,
            typeof data === 'string'
                ? data
                : JSON.stringify(
                    data,
                    undefined,
                    4
                )
        )
        .then(() => {
            console.log(`Writing to ${jsonfilepath}`);
            return data;
        });
}