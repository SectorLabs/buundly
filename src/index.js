#!/usr/local/bin/node

const commander = require('commander');
const Table = require('cli-table');
const filesize = require('filesize');

const collectFiles = require('./collectFiles');

commander
    .version('1.0')
    .usage('<directory> [options]')
    .description('Lists sizes of bundles in a directory and enforces limits.')
    .arguments('<directory>')
    .option('-a, --all', 'Shows all collected files, including non-mapped ones')
    .parse(process.argv);

const config = require('../config.js');
const files = collectFiles(config, commander.args[0]);

console.log(commander);

const table = new Table({
    head: ['Name', 'Size'],
    colWidths: [30, 20],
});

files
    .filter(file => commander.all || !!file.name)
    .map(file => [file.name || file.fileName, filesize(file.size)])
    .forEach(row => {
        table.push(row);
    });

console.log(table.toString());
