#!/usr/local/bin/node

const commander = require('commander');
const collectFiles = require('./fileCollector');
const Table = require('cli-table');
const filesize = require('filesize');

commander
    .version('1.0')
    .usage('<directory> [options]')
    .description('Lists sizes of bundles in a directory and enforces limits.')
    .arguments('<directory>')
    .parse(process.argv);

const config = require('../config.js');
const files = collectFiles(config, commander.args[0]);

const table = new Table({
    head: ['Name', 'Size'],
    colWidths: [30, 20],
});

files
    .filter(file => !!file.name)
    .map(file => [file.name, filesize(file.size)])
    .forEach(row => {
        table.push(row);
    });

console.log(table.toString());
