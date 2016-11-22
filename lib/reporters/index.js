module.exports = {
  basic: require('./basic'),
  fps: require('./fps'),
  json: (data) => JSON.stringify(data, null, '  ')
};
