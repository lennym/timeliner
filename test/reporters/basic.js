const basic = require('../../lib/reporters/basic');
const assert = require('assert');

describe('Basic Reporter', () => {

  it('returns a mean when passed a single run', () => {
    const input = {
      'http://example.com': [
        []
      ]
    };
    const output = basic(input, () => {
      return {
        metric: 1
      };
    });
    assert.equal(output['http://example.com'].metric.mean, 1);
  });

  it('returns a stddev of zero when passed a single run', () => {
    const input = {
      'http://example.com': [
        []
      ]
    };
    const output = basic(input, () => {
      return {
        metric: 1
      };
    });
    assert.equal(output['http://example.com'].metric.stddev, 0);
  });

});
