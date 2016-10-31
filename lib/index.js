const Promise = require('bluebird');

const chromedriver = require('./chromedriver');
const runner = require('./runner');

function analyser (opts) {

  opts.count = opts.count || 5;

  if (!opts.url) {
    return Promise.reject(new Error('`url` option must be provided'));
  }

  return Promise.using(chromedriver(), () => {
    return runner(opts);
  });
}

module.exports = analyser;
