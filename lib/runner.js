'use strict';

const Promise = require('bluebird');
const times = require('./times');
const page = require('./page');
const zip = require('./zip');

function runner (opts) {
  const iterator = (url) => page(Object.assign({}, opts, { url: url }));
  const concurrency = opts.parallel ? opts.url.length : 1;

  let interrupted = false;
  process.on('SIGINT', () => {
    if (interrupted) {
      process.exit();
    } else {
      interrupted = true;
      console.log('Shutting down - press CTRL^C again to terminate immediately');
    }
  });
  return Promise.reduce(times(opts.count), (results) => {
    if (interrupted) {
      return results;
    } else {
      return Promise.map(opts.url, iterator, { concurrency: concurrency })
        .then((logs) => results.concat([logs]));
    }
  }, [])
  .then(zip);
}

module.exports = runner;
