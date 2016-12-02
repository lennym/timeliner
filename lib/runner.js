const wd = require('wd');
const times = require('./times');
const Promise = require('bluebird');
const page = require('./page');

function runner (opts) {
  opts.driver = opts.driver || 'http://localhost:9515';
  opts.browser = wd.remote(opts.driver, 'promiseChain');
  const f = page(opts);
  return Promise.map(times(opts.count), () => f().then((r) => { opts.progress.increment(); return r; }), { concurrency: 1 });
}

module.exports = runner;
