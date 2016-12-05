const wd = require('wd');
const times = require('./times');
const Promise = require('bluebird');
const page = require('./page');

const request = require('request');
const httpUtils = require('wd/lib/http-utils');

wd.Webdriver.prototype._stream = function (opts) {
  var _this = this;

  // http options init
  var httpOpts = httpUtils.newHttpOpts(opts.method, this._httpConfig);

  var url = httpUtils.buildJsonCallUrl(this.noAuthConfigUrl, this.sessionID, opts.relPath, opts.absPath);

  // building callback
  var cb = opts.cb;
  if (opts.emit) {
    // wrapping cb if we need to emit a message
    var _cb = cb;
    cb = function () {
      var args = [].slice.call(arguments, 0);
      _this.emit(opts.emit.event, opts.emit.message);
      if (_cb) { _cb.apply(_this, args); }
    };
  }

  // logging
  httpUtils.emit(this, httpOpts.method, url, opts.data);

  // writting data
  var data = opts.data || {};
  httpOpts.prepareToSend(url, data);
  // building request
  return request(httpOpts);
};
wd.Webdriver.prototype.logstream = function (logType) {
  return this._stream({
    method: 'POST',
    relPath: '/log',
    data: { type: logType }
  });
};

function zip (results) {
  return results.reduce((lists, run) => {
    run.forEach((logs, i) => {
      lists[i] = lists[i] || [];
      lists[i].push(logs);
    });
    return lists;
  }, []);
}

function runner (opts) {
  opts.driver = opts.driver || 'http://localhost:9515';
  const iterator = (url) => {
    const browser = wd.remote(opts.driver, 'promiseChain');
    return page(Object.assign({}, opts, { url: url, browser: browser }))
      .then((r) => {
        opts.progress.increment();
        return r;
      });
  };
  return Promise.map(times(opts.count), () => {
    return Promise.map(opts.url, iterator, { concurrency: opts.parallel ? 2 : 1 });
  }, { concurrency: 1 })
  .then((results) => zip(results));
}

module.exports = runner;
