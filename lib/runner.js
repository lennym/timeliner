const wd = require('wd');
const times = require('./times');
const Promise = require('bluebird');
const page = require('./page');

function runner (opts) {
  opts.browser = wd.remote('http://localhost:9515', 'promiseChain');

  return Promise.map(times(opts.count), page(opts), { concurrency: 1 });
};

module.exports = runner;
