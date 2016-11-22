const wd = require('wd');
const Promise = require('bluebird');
const browser = require('./browser');
const normalise = require('./normalise-logs');

function test (opts) {
  return function () {
    return Promise.using(browser(opts.browser), (session) => {
      return session
        .get(opts.url)
        .then(() => {
          return Promise.resolve()
            .then(() => {
              if (typeof opts.inject === 'function') {
                return opts.inject(session);
              }
            })
            .then(() => {
              return session.waitFor(wd.asserters.jsCondition(`document.readyState==='complete'`), 30000);
            })
            .then(() => {
              return session;
            });
        })
        .sleep(opts.sleep)
        .log('performance')
        .then((logs) => {
          return normalise(logs, opts.url);
        });
    });
  };
}

module.exports = test;
