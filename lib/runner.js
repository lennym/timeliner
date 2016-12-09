'use strict';
const v8 = require('v8');
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
      console.log('\nShutting down gracefully - CTRL^C again to terminate immediately');
    }
  });
  return Promise.reduce(times(opts.count), (results, i) => {
    if (interrupted) {
      // if count is set very high then we can hit maximum call stack size
      // introduce some async every 1000 iterations to break call stack
      return i % 1000 ? results : Promise.delay(0).then(() => results);
    }
    const memory = v8.getHeapStatistics();
    if (memory.total_available_size / memory.heap_size_limit < 0.1) {
      console.log('Less than 10% of process memory limit remaining. Terminating...');
      console.log('To increase available memory start with `--max_old_space_size=<size>`');
      interrupted = true;
      return results;
    } else {
      return Promise.map(opts.url, iterator, { concurrency: concurrency })
        .then((logs) => results.concat([logs]));
    }
  }, [])
  .then(zip);
}

module.exports = runner;
