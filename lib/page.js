const wd = require('wd');
const Promise = require('bluebird');
const bl = require('bl');
const JSONStream = require('JSONStream');
const browser = require('./browser');
const normalise = require('./normalise-logs');

const blacklist = ['UpdateLayerTree', 'Layout', 'FunctionCall', 'UpdateLayoutTree',
  'EventDispatch', 'TimerFire', 'TimerInstall', 'TimerRemove', 'ResourceSendRequest', 'ResourceReceivedData'];

function test (opts) {
  return Promise.using(browser(opts.browser), (session) => {
    return session
      .sleep(500)
      .setWindowSize(1024, 768).catch(() => {})
      .get(opts.url)
      .then(() => {
        return Promise.resolve()
          .then(() => {
            if (opts.scroll || opts.reporter === 'fps') {
              return session.execute('function f () { window.scrollBy(0,5); window.requestAnimationFrame(f); } window.requestAnimationFrame(f);');
            }
          })
          .then(() => {
            if (typeof opts.inject === 'function') {
              return opts.inject(session);
            }
          })
          .then(() => {
            return session.waitFor(wd.asserters.jsCondition(`document.readyState==='complete'`), 120000)
              .catch(() => {
                console.error('Page loading timed out after 120s');
              });
          })
          .then(() => {
            return session;
          });
      })
      .sleep(opts.sleep)
      .then(() => {
        return new Promise((resolve, reject) => {
          const stream = session.logstream('performance')
            .pipe(JSONStream.parse('value.*', (item) => {
              item.message = JSON.parse(item.message);
              item.name = item.message.message.params.name;
              item.timestamp = item.message.message.params.timestamp || (item.message.message.params.ts / 1e6);

              if (item.message.message.params && item.message.message.params.cat === '__metadata') {
                return;
              }
              if (blacklist.indexOf(item.name) !== -1) {
                return;
              }
              return item;
            }))
            .pipe(JSONStream.stringify())
            .pipe(bl((err, data) => {
              err ? reject(err) : resolve(JSON.parse(data.toString()));
            }));
          stream.on('error', reject);
        });
      })
      .then((logs) => {
        return normalise(logs, opts.url);
      });
  })
  .catch(() => []);
}

module.exports = test;
