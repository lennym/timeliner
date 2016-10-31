const Promise = require('bluebird');

function browser (b) {
  return Promise.resolve()
    .then(() => {
      return b.init({
        browserName: 'chrome',
        loggingPrefs: {
          performance: 'ALL'
        },
        chromeOptions: {
          perfLoggingPrefs: {
            enableNetwork: true
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
