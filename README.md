# timeliner

## Automated Browser Timeline Analyser

Uses chromedriver to load a webpage a number of times and aggregates performance metrics from Chrome's devtools timelines.

## Usage

### From the command line:

```shell
$ timeliner http://example.com
```

### From code:

```javascript
const timeliner = require('timeliner');

timeliner({ url: 'http://google.com' })
  .then(timeliner.reporters.basic)
  .then((results) => {
    // your code here
  });
```

The reporter step can be omitted to provide the raw timeline logs to analyse as you require.

## Options

All options can be passed as flags in the command line, or as arguments in code unless otherwise specified.

### `url`

*Required* - set the page url to be loaded

### `count`

*Optional* - set the nuber of times to load the page before aggregating results - Default `5`

### `reporter`

*CLI only* *Optional* - set the reporter to be used to output results - supported values: `basic`, `json`
