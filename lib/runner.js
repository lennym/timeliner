const Promise = require('bluebird');
const times = require('./times');
const page = require('./page');
const zip = require('./zip');

function runner (opts) {
  const iterator = (url) => page(Object.assign({}, opts, { url: url }));
  const concurrency = opts.parallel ? opts.url.length : 1;

  return Promise.map(times(opts.count), () => {
    return Promise.map(opts.url, iterator, { concurrency: concurrency });
  }, { concurrency: 1 })
  .then(zip);
}

module.exports = runner;
