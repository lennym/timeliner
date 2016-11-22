const Promise = require('bluebird');

const chromedriver = require('./chromedriver');
const runner = require('./runner');
const reporters = require('./reporters');

function analyser (opts) {
  opts.count = opts.count || 5;
  opts.sleep = opts.sleep || 0;
  if (!opts.url) {
    return Promise.reject(new Error('`url` option must be provided'));
  }

  return Promise.using(chromedriver(), () => {
    return runner(opts);
  });
}

analyser.reporters = reporters;

module.exports = analyser;
