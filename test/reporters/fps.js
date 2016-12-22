const fps = require('../../lib/reporters/fps');

describe('FPS Reporter', () => {
  it('executes without error', () => {
    const input = {
      'http://example.com': [
        []
      ]
    };
    fps(input);
  });
});
