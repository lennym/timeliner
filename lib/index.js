const Promise = require('bluebird');
const Progress = require('cli-progress');

const chromedriver = require('./chromedriver');
const runner = require('./runner');
const reporters = require('./reporters');

function analyser (opts) {
  opts.count = opts.count || 5;
  opts.sleep = opts.sleep || 0;
  opts.scroll = opts.scroll || false;
  if (!opts.url || opts.url.length === 0) {
    return Promise.reject(new Error('`url` option must be provided'));
  }

  return Promise.using(chromedriver(), () => {
    if (typeof opts.url === 'string') {
      opts.url = [opts.url];
    }

    if (opts.progress) {
      opts.progress = new Progress.Bar({ format: '[{bar}] {percentage}% | ETA: {eta_formatted}' });
      opts.progress.start(opts.url.length * opts.count);
    } else {
      opts.progress = { increment: () => {}, stop: () => {} };
    }

    return Promise.map(opts.url, (url) => {
      return runner(Object.assign({}, opts, { url: url }));
    })
    .then((result) => {
      opts.progress.stop();
      return result;
    });
  });
}

analyser.reporters = reporters;

module.exports = analyser;
