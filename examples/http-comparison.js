/*
  Compare the number of http requests made while loading Twitter and Facebook homepages
*/

const timeliner = require('timeliner');

function customMetrics (logs) {
  const count = logs
    .filter(row => row.message.message.method === 'Network.responseReceived')
    .length;

  return {
    'Total HTTP Requests': count
  };
}

timeliner({ url: ['https://facebook.com', 'https://twitter.com'], count: 1, progress: true })
  .then(logs => timeliner.reporters.basic(logs, customMetrics))
  .then(d => timeliner.reporters.table(d, ['Facebook', 'Twitter']))
  .then(result => console.log(result));
