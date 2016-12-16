const babar = require('babar');

function chart (data, options) {
  options = options || {};
  options.height = options.height || 10;
  data = data.map((value, i) => [i, value]);
  data.unshift([0, 0]);
  return babar(data, options);
}

module.exports = function (data, metric) {
  const options = Object.keys(data).map(u => ({ caption: `${u} - ${metric}` }));
  return Object.keys(data).map((key, i) => {
    const d = data[key][metric].raw;
    return chart(d, options[i]);
  });
};
