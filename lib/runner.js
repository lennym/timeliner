const wd = require('wd');
const times = require('./times');
const Promise = require('bluebird');
const page = require('./page');

function runner (opts) {
  opts.driver = opts.driver || 'http://localhost:9515';
  opts.browser = wd.remote(opts.driver, 'promiseChain');
  return Promise.map(times(opts.count), page(opts), { concurrency: 1 });
}

module.exports = runner;
