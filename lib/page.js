const Promise = require('bluebird');
const browser = require('./browser');

function test (opts) {
  return function () {
    return Promise.using(browser(opts.browser), (session) => {
      return session
        .get(opts.url)
        .log('performance');
    });
  };
}

module.exports = test;
