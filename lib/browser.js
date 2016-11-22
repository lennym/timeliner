const Promise = require('bluebird');

function browser (b) {
  return Promise.resolve()
    .then(() => {
      return b.init({
        browserName: 'chrome',
        pageLoadStrategy: 'none',
        loggingPrefs: {
          performance: 'ALL'
        },
        chromeOptions: {
          perfLoggingPrefs: {
            traceCategories: 'devtools.timeline,test_fps'
          }
        }
      })
      .then(() => b);
    })
    .disposer(() => {
      return b.quit();
    });
}

module.exports = browser;
