'use strict';

const chalk = require('chalk');
const ttest = require('ttest');
const Table = require('cli-table');

function table (result, headings) {
  let head, rows;
  headings = headings || [];
  if (result.length === 1) {
    head = ['metric', 'mean', 'min', 'max'];
    rows = Object.keys(result[0])
      .map((metric) => [
        metric,
        `${result[0][metric].mean.toFixed(3)} (+/-${result[0][metric].stddev.toFixed(2)})`,
        result[0][metric].min.toFixed(3),
        result[0][metric].max.toFixed(3)
      ]);
  } else if (result.length === 2) {
    head = ['metric'];
    result.forEach((r, i) => head.push(headings[i] || i));
    head.push('p < 0.05');
    rows = Object.keys(result[0])
      .map((metric) => {
        const row = result.map((res) => {
          return res[metric] && res[metric].mean;
        });
        const min = Math.min.apply(Math, row);
        const max = Math.max.apply(Math, row);

        const colored = row.reduce((r, m, i) => {
          let value = typeof m === 'number' ? m.toFixed(3) : '-';
          const stddev = typeof result[i][metric].stddev === 'number' ? result[i][metric].stddev.toFixed(2) : '-';
          if (m === min) {
            value = chalk.green(value);
          } else if (m === max) {
            value = chalk.red(value);
          }
          r.push(`${value} (±${stddev})`);
          return r;
        }, [metric]);
        if (result[0][metric] && result[1][metric] && result[0][metric].raw.length > 1 && result[1][metric].raw.length > 1) {
          const tt = ttest(result[0][metric].raw, result[1][metric].raw, { varEqual: true });
          if (!tt.valid()) {
            colored.push(tt.pValue().toFixed(3) + ' ' + chalk.green('✔'));
          } else {
            colored.push(tt.pValue().toFixed(3) + ' ' + chalk.red('✘'));
          }
        } else {
          colored.push('-');
        }
        return colored;
      });
  }

  const table = new Table({ head: head });
  table.push.apply(table, rows);
  return table.toString();
}

module.exports = table;
