# timeliner

## Automated Browser Timeline Analyser

Uses chromedriver to load a webpage a number of times and aggregates performance metrics from Chrome's devtools timelines.

## Usage

### From the command line:

```shell
$ timeliner http://example.com
```

```shell
# analyse scrolling performance on a long webpage
$ timeliner http://buzzfeed.com --reporter fps --sleep 5000
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

set the number of times to load the page before aggregating results - Default `5`

### `reporter`

*CLI only* - set the reporter to be used to output results - supported values: `basic`, `fps`, `json`

### `scroll`

if set, injects a script into the page which binds a vertical scroll to `window.requestAnimationFrame` making the page scroll continuously, recommended if using `fps` reporter - Default `false`

### `sleep`

set how long (in ms) after the page completes loading to continue recording metrics - Default `0`

### `driver`

sets the url of the webdriver remote server to use - Default `http://localhost:9515` (note: default webdriver is started automatically)
