#!/usr/bin/env node

const path = require('path');

const commander = require('commander');
const Table = require('cli-table');
const filesize = require('filesize');

const collectFiles = require('./collectFiles');

commander
    .version('1.0')
    .usage('<directory> [options]')
    .arguments('<directory>')
    .option('-c, --config <configFilePath>', 'Path to the configuration file.')
    .option('-a, --all', 'Shows all collected files, including non-mapped ones')
    .description('Lists sizes of bundles in a directory and enforces limits.')
    .parse(process.argv);

if (!commander.args[0]) {
    commander.outputHelp();
    process.exit(1);
}

const configFileName = commander.config || './.buundle.config.js';
const configFilePath = path.resolve(configFileName);

let config = null;
try {
    config = require(configFilePath);
} catch (error) {
    console.error(`Could not find config file '${configFileName}'.`);
    process.exit(1);
}

if (!config.extensions) {
    console.error('No extensions configured in config file.');
    process.exit(1);
}

const files = collectFiles(config, commander.args[0]);

const table = new Table({
    head: ['Name', 'Size', 'Size (bytes)', 'Max size'],
    colWidths: [30, 15, 15, 15],
});

files
    .filter(file => commander.all || !!file.name)
    .map(file => [
        file.name || file.fileName,
        filesize(file.size),
        file.size,
        file.maxSize === null ? '' : filesize(file.maxSize),
    ])
    .forEach(row => {
        table.push(row);
    });

console.log(table.toString());

console.log('');
let limitsExceeded = false;
files.filter(file => file.maxSize !== null).forEach(file => {
    if (file.size > file.maxSize) {
        console.error(
            `${file.fileName} exceeds limit of ${filesize(
                file.maxSize,
            )} by ${filesize(file.size - file.maxSize)}`,
        );
        limitsExceeded = true;
    }
});

process.exit(limitsExceeded ? 1 : 0);
