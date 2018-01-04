const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const minimatch = require('minimatch');

/**
 * Attempts to get the mapped name for a file name.
 *
 * Name mappings are specified in the configuration,
 * mapping a file name to a more readable name.
 *
 * @returns The mapped name for the specified file
 * name or null if there was no mapped name.
 */
const getMappedName = (mappings, fileName) =>
    Object.keys(mappings)
        .map(
            pattern =>
                minimatch(fileName, pattern) ? mappings[pattern] : null,
        )
        .filter(name => !!name)[0] || null;

/**
 * Attemps to get the maximum file size allowed for the
 * specified file name.
 *
 * File size limits are specified in the configuration
 * using a glob pattern.
 *
 * @returns The maximum size for the specified file in
 * bytes or null when there was no limit found.
 */
const getMaxFileSize = (limits, fileName) => {
    const maxSize = Object.keys(limits)
        .map(pattern => (minimatch(fileName, pattern) ? limits[pattern] : null))
        .filter(limit => limit !== null)[0];

    if (maxSize === undefined) {
        return null;
    }

    return maxSize;
};

/**
 * Collects all bundle files in the specified directory.
 *
 * For each file, it collects:
 *
 * - The mapped name.
 * - Raw size in bytes.
 *
 * @returns An array of objects.
 */
const collectFiles = (config, directory) => {
    const files = fs
        .readdirSync(directory)
        .filter(fileName =>
            config.extensions.some(ext => fileName.endsWith(ext)),
        )
        .map(fileName => ({
            name: getMappedName(config.nameMappings || {}, fileName),
            fileName: fileName,
            size: fs.statSync(path.join(directory, fileName)).size,
            maxSize: getMaxFileSize(config.limits || {}, fileName),
        }));

    return _.sortBy(files, file => !file.name);
};

module.exports = collectFiles;
