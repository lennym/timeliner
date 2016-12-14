module.exports = {
  basic: require('./basic'),
  fps: require('./fps'),
  chart: require('./chart'),
  table: require('./table'),
  json: (data) => JSON.stringify(data, null, '  ')
};
