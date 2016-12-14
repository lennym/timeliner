const statistics = require('statistics');

function metrics (set) {
  const m = {
    render: getProfileTime('Paint', set),
    domcontentloaded: getEventTime('Page.domContentEventFired', set),
    load: getEventTime('Page.loadEventFired', set)
  };
  const custom = loadCustomMetrics(set);
  return Object.assign(m, custom);
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
  const line = data.filter(isCustomMetric).find(line => line.message.message.params.args.data.message === event);
  return line && line.timestamp;
}

function getEventTime (event, data) {
  const line = data.find((line) => line.message.message.method === event);
  return line && line.timestamp;
}

function getProfileTime (event, data) {
  const line = data.find((line) => line.message.message.method === 'Tracing.dataCollected' && line.message.message.params.name === event);
  return line && line.timestamp;
}

function result (timings, key) {
  const results = timings.map(t => t[key]).filter(t => t);
  const stats = results.reduce(statistics);
  return {
    mean: stats.mean,
    stddev: stats.stdev,
    min: Math.min.apply(Math, results),
    max: Math.max.apply(Math, results),
    raw: results
  };
}

function basicReporter (data, m) {
  m = m || metrics;
  return data.map((d) => {
    const timings = d.map(m);

    return Object.keys(timings[0])
      .reduce((list, key) => {
        list[key] = result(timings, key);
        return list;
      }, {});
  });
}

module.exports = basicReporter;
