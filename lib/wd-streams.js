const wd = require('wd');
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
