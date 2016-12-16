'use strict';

const chalk = require('chalk');
const ttest = require('ttest');
const Table = require('cli-table');
const union = require('lodash.union');

function getMetrics (result) {
  return union.apply(null, Object.keys(result).map(key => Object.keys(result[key])));
}

function table (result, headings) {
  let head, rows;
  headings = headings || Object.keys(result) || [];
  const metrics = getMetrics(result);
  const urls = Object.keys(result);
  if (urls.length === 1) {
    result = result[urls[0]];
    head = ['metric', 'mean', 'min', 'max'];
    rows = metrics.map((metric) => {
      const stddev = typeof result[metric].stddev === 'number' ? `(+/-${result[metric].stddev.toFixed(3)})` : '';
      let mean = result[metric].mean;
      if (!mean && result[metric].raw.length === 1) {
        mean = result[metric].raw[0];
      }
      return [
        metric,
        `${mean.toFixed(3)} ${stddev}`,
        result[metric].min.toFixed(3),
        result[metric].max.toFixed(3)
      ]
    });
  } else {
    head = ['metric'];
    urls.forEach((r, i) => head.push(headings[i] || i));
    if (urls.length === 2) {
      head.push('p < 0.05');
    }
    rows = metrics.map((metric) => {
      const row = urls.map((url) => {
        return result[url][metric] && result[url][metric].mean;
      });
      const min = Math.min.apply(Math, row);
      const max = Math.max.apply(Math, row);

      const colored = urls.reduce((r, url) => {
        const m = result[url][metric];
        let value = typeof m.mean === 'number' ? m.mean.toFixed(3) : '-';
        const stddev = typeof m.stddev === 'number' ? m.stddev.toFixed(3) : '-';
        if (m === min) {
          value = chalk.green(value);
        } else if (m === max) {
          value = chalk.red(value);
        }
        r.push(`${value} (±${stddev})`);
        return r;
      }, [metric]);

      // if doing a two-up comparison, add a column for p-values
      if (urls.length === 2) {
        if (result[urls[0]][metric] && result[urls[1]][metric] && result[urls[0]][metric].raw.length > 1 && result[urls[1]][metric].raw.length > 1) {
          const tt = ttest(result[urls[0]][metric].raw, result[urls[1]][metric].raw, { varEqual: true });
          if (!tt.valid()) {
            colored.push(tt.pValue().toFixed(3) + ' ' + chalk.green('✔'));
          } else {
            colored.push(tt.pValue().toFixed(3) + ' ' + chalk.red('✘'));
          }
        } else {
          colored.push('-');
        }
      }
      return colored;
    });
  }

  const table = new Table({ head: head });
  table.push.apply(table, rows);
  return table.toString();
}

module.exports = table;
