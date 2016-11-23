const mean = require('lodash.meanby');

function metrics (set) {
  const m = {
    render: getProfileTime('Paint', set),
    domcontentloaded: getEventTime('Page.domContentEventFired', set),
    load: getEventTime('Page.loadEventFired', set)
  };
  const custom = loadCustomMetrics(set);
  Object.assign(m, custom);

  return m;
}

function isCustomMetric (line) {
  return line.message.message.method === 'Tracing.dataCollected' && line.message.message.params.name === 'TimeStamp';
}

function getCustomMetricList (set) {
  const events = set.filter(isCustomMetric);
  return events
    .map(line => line.message.message.params.args.data.message)
    .filter(key => key.match(/^timeliner\./))
    .reduce((list, key) => {
      if (list.indexOf(key) === -1) {
        list.push(key);
      }
      return list;
    }, []);
}

function loadCustomMetrics (set) {
  const keys = getCustomMetricList(set);
  return keys.reduce((timings, key) => {
    timings[key.replace(/^timeliner./, '')] = getCustomEventTime(key, set);
    return timings;
  }, {});
}

function getCustomEventTime (event, data) {
  const line = data.filter(isCustomMetric).filter(line => line.message.message.params.args.data.message === event)[0];
  return line && line.timestamp;
}

function getEventTime (event, data) {
  const line = data.filter((line) => line.message.message.method === event)[0];
  return line && line.timestamp;
}

function getProfileTime (event, data) {
  const line = data.filter((line) => line.message.message.method === 'Tracing.dataCollected' && line.message.message.params.name === event)[0];
  return line && line.timestamp;
}

function result (timings, key) {
  return {
    mean: mean(timings, key),
    min: Math.min.apply(Math, timings.map(t => t[key])),
    max: Math.max.apply(Math, timings.map(t => t[key]))
  };
}

function basicReporter (data) {
  const timings = data.map(metrics);

  return Object.keys(timings[0])
    .reduce((list, key) => {
      list[key] = result(timings, key);
      return list;
    }, {});
}

module.exports = basicReporter;
