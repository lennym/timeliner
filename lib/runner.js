const wd = require('wd');
const Promise = require('bluebird');
const times = require('./times');
const page = require('./page');
const zip = require('./zip');

require('./wd-streams');

function runner (opts) {
  opts.driver = opts.driver || 'http://localhost:9515';
  const iterator = (url) => {
    const browser = wd.remote(opts.driver, 'promiseChain');
    return page(Object.assign({}, opts, { url: url, browser: browser }));
  };
  return Promise.map(times(opts.count), () => {
    return Promise.map(opts.url, iterator, { concurrency: opts.parallel ? opts.url.length : 1 });
  }, { concurrency: 1 })
  .then((results) => zip(results));
}

module.exports = runner;
