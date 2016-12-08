'use strict';

const chalk = require('chalk');
const ttest = require('ttest');
const Table = require('cli-table');

function table (result, urls) {
  let head, rows;

  if (!urls || urls.length === 1) {
    head = ['metric', 'mean', 'min', 'max'];
    rows = Object.keys(result[0])
      .map((metric) => [
        metric,
        result[0][metric].mean.toFixed(3),
        result[0][metric].min.toFixed(3),
        result[0][metric].max.toFixed(3)
      ]);
  } else if (urls.length === 2) {
    head = ['metric'];
    urls.forEach(url => head.push(url));
    head.push('p < 0.05');
    rows = Object.keys(result[0])
      .map((metric) => {
        const row = result.map((res) => {
          return res[metric] && res[metric].mean;
        });
        const min = Math.min.apply(Math, row);
        const max = Math.max.apply(Math, row);

        const colored = row.reduce((r, m) => {
          if (m === min) {
            r.push(chalk.green(m.toFixed(3)));
          } else if (m === max) {
            r.push(chalk.red(m.toFixed(3)));
          } else {
            r.push(typeof m === 'number' ? m.toFixed(3) : '-');
          }
          return r;
        }, [metric]);
        if (result[0][metric] && result[1][metric]) {
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
