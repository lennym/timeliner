const babar = require('babar');
const mapValues = require('lodash.mapValues');

function chart (data, options) {
  options = options || {};
  options.height = options.height || 10;
  data = data.map((value, i) => [i, value]);
  data.unshift([0, 0]);
  return babar(data, options);
}

module.exports = function (data, options) {
  return mapValues(data, (d, i) => {
    return chart(d, options[i]);
  });
};
