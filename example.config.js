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
