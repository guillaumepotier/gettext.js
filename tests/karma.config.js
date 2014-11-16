module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: ['mocha', 'sinon-expect'],
    files: [
        'lib/gettext.js',
        'tests/tests.js',
    ],
    exclude: [],
    reporters: ['progress'], // or `dots`
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true
  });
};
