#!/usr/bin/env node

const commander = require('commander');
const Table = require('cli-table');
const filesize = require('filesize');

const collectFiles = require('./collectFiles');

commander
    .version('1.0')
    .usage('<directory> [options]')
    .arguments('<directory>')
    .option('-a, --all', 'Shows all collected files, including non-mapped ones')
    .description('Lists sizes of bundles in a directory and enforces limits.')
    .parse(process.argv);

if (!commander.args[0]) {
    commander.outputHelp();
    process.exit(1);
}

const config = require('../config.js');
const files = collectFiles(config, commander.args[0]);

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
