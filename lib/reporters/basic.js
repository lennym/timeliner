const mean = require('lodash.meanby');

function basicReporter (data) {
  const timings = data.map((set) => {
    return {
      render: getProfileTime('Paint', set),
      domcontentloaded: getEventTime('Page.domContentEventFired', set),
      load: getEventTime('Page.loadEventFired', set)
    };
  });

  return {
    render: result(timings, 'render'),
    domcontentloaded: result(timings, 'domcontentloaded'),
    load: result(timings, 'load')
  };
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

module.exports = basicReporter;
