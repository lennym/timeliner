const chart = require('../../lib/reporters/chart');

describe('Chart Reporter', () => {
  it('executes without error', () => {
    const input = {
      'http://example.com': {
        metric: {
          mean: 1,
          min: 1,
          max: 1,
          raw: [0, 1, 2]
        }
      }
    };
    chart(input, 'metric');
  });
});
