module.exports = {
  basic: require('./basic'),
  fps: require('./fps'),
  table: require('./table'),
  json: (data) => JSON.stringify(data, null, '  ')
};
