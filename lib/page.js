const Promise = require('bluebird');
const browser = require('./browser');
const normalise = require('./normalise-logs');

function test (opts) {
  return function () {
    return Promise.using(browser(opts.browser), (session) => {
      return session
        .get(opts.url)
        .log('performance')
        .then((logs) => {
          return normalise(logs, opts.url);
        });
    });
  };
}

module.exports = test;
