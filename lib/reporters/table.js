const Table = require('cli-table');
const basic = require('./basic');

function table (data) {
  const result = basic(data);

  const table = new Table({ head: ['metric', 'mean', 'min', 'max'] });
  const rows = Object.keys(result)
    .map((metric) => [
      metric,
      result[metric].mean.toFixed(3),
      result[metric].min.toFixed(3),
      result[metric].max.toFixed(3)
    ]);
  table.push.apply(table, rows);

  return table.toString();
}

module.exports = table;
