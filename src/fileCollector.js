const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const minimatch = require('minimatch');

const getMappedName = (mappings, fileName) =>
    Object.keys(mappings)
        .map(
            pattern =>
                minimatch(fileName, pattern) ? mappings[pattern] : null,
        )
        .filter(name => !!name)[0] || null;

const collectFiles = (config, directory) => {
    const files = fs
        .readdirSync(directory)
        .filter(fileName =>
            config.extensions.some(ext => fileName.endsWith(ext)),
        )
        .map(fileName => ({
            name: getMappedName(config.nameMappings, fileName),
            fileName: fileName,
            size: fs.statSync(path.join(directory, fileName)).size,
        }));

    return _.sortBy(files, file => !file.name);
};

module.exports = collectFiles;
