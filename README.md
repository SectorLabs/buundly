# Buundly

Keep an eye on your bundle size. Integrate it into your CI and make sure you don't massively increase your bundle size accidentely.

![example](https://i.imgur.com/eKMgwJv.png)

## Configuration

An example ([example.config.js](https://github.com/SectorLabs/buundly/blob/master/example.config.js)):

```
module.exports = {
    extensions: ['.js', '.js.gz', '.js.br', '.css', '.css.gz', '.css.br'],
    nameMappings: {
        'browser.desktop.*.js': 'JS / Desktop',
        'browser.mobile.*.js': 'JS / Mobile',
        'browser.desktop.*.js.br': 'JS / Desktop / Brotli',
        'browser.mobile.*.js.br': 'JS / Mobile / Brotli',
        'browser.desktop.*.js.gz': 'JS / Desktop / GZip',
        'browser.mobile.*.js.gz': 'JS / Mobile / GZip',
        'browser.desktop.*.css': 'CSS / Desktop',
        'browser.mobile.*.css': 'CSS / Mobile',
    },
    limits: {
        'browser.desktop.*.js.br': 180000,
        'browser.mobile.*.js.br': 140000,
    },
};
```

## Enforcing limits
By specifying a dictionary of file name patterns and maximum file sizes in bytes in the configuration file, you can instruct Buundly to verify that files are not larger than the configured limit. If configured, Buundly will log which files exceed the limit and by how much. The exit code of the process will be 1 (failure) if a file crosses the limit.

## Usage
By default, Buundly looks for a file named `.buundly.config.js` in the current directory. You can override this with the `-c` flag:

```
$ buundly [dir] -c ./bla/myconfig.js
```

By default, Buundly only shows files for which there is a name mapping configured. By specifying `-a`, you force Buundly to show all files it found.

Here is a complete overview of all options Buundly supports:

```
  Usage: buundly <directory> [options]

  Lists sizes of bundles in a directory and enforces limits.


  Options:

    -V, --version                  output the version number
    -c, --config <configFilePath>  Path to the configuration file.
    -a, --all                      Shows all collected files, including non-mapped ones
    -h, --help                     output usage information
```
