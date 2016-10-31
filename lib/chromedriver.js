const chromedriver = require('chromedriver');
const Promise = require('bluebird');

module.exports = function () {
  return Promise.resolve()
    .then(() => {
      return chromedriver.start();
    })
    .disposer(() => {
      return chromedriver.stop();
    });
};
