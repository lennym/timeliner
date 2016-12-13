/*
  An example which loads the github homepage and counts the number of images requested
*/

const timeliner = require('timeliner');

function customMetrics (logs) {
  const imagecount = logs
    .filter(row => row.message.message.method === 'Network.responseReceived')
    .filter(row => row.message.message.params.response.headers['Content-Type'] && row.message.message.params.response.headers['Content-Type'].match(/^image\//))
    .length;

  return {
    'Image Count': imagecount
  };
}

timeliner({ url: 'https://github.com', count: 1 })
  .then(logs => timeliner.reporters.basic(logs, customMetrics))
  .then(timeliner.reporters.table)
  .then(result => console.log(result));
