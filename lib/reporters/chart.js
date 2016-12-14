const babar = require('babar');

function chart (data, options) {
  options = options || {};
  options.height = options.height || 10;
  data = data.map((value, i) => [i, value]);
  data.unshift([0, 0]);
  return babar(data, options);
}

module.exports = function (data, options) {
  return data.map(d => {
    return chart(d, options);
  });
};
