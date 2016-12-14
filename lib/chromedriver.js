const chromedriver = require('chromedriver');
const Promise = require('bluebird');
const cp = require('child_process');

module.exports = function () {
  return Promise.resolve()
    .then(() => {
      const p = cp.spawn(chromedriver.path, [], { detached: true });
      process.on('exit', () => { p.kill(); });
      return p;
    })
    .disposer((p) => {
      p.kill();
    });
};
