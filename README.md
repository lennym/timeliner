# timeliner

## Automated Browser Timeline Analyser

Uses chromedriver to load a webpage a number of times and aggregates performance metrics from Chrome's devtools timelines.

## Usage

### From the command line:

```shell
$ timeliner http://example.com

# outputs
┌──────────────────┬───────┬───────┬───────┐
│ metric           │ mean  │ min   │ max   │
├──────────────────┼───────┼───────┼───────┤
│ render           │ 0.166 │ 0.147 │ 0.209 │
├──────────────────┼───────┼───────┼───────┤
│ domcontentloaded │ 0.166 │ 0.147 │ 0.209 │
├──────────────────┼───────┼───────┼───────┤
│ load             │ 0.119 │ 0.102 │ 0.163 │
└──────────────────┴───────┴───────┴───────┘
```

### Side by side comparison:

You can run timeliner against two websites in parallel which will return a comparison of metrics, with an indicator of whether the difference is statistically significant (p<0.05).

```shell
$ timeliner https://facebook.com https://twitter.com

# outputs
┌──────────────────┬──────────────────────┬─────────────────────┬──────────┐
│ metric           │ https://facebook.com │ https://twitter.com │ p < 0.05 │
├──────────────────┼──────────────────────┼─────────────────────┼──────────┤
│ render           │ 0.835                │ 1.441               │ 0.079 ✘  │
├──────────────────┼──────────────────────┼─────────────────────┼──────────┤
│ domcontentloaded │ 0.916                │ 1.492               │ 0.080 ✘  │
├──────────────────┼──────────────────────┼─────────────────────┼──────────┤
│ load             │ 0.989                │ 3.036               │ 0.118 ✘  │
└──────────────────┴──────────────────────┴─────────────────────┴──────────┘
```

*Note: you may need to increase the count option (i.e. sample size) in order to see statistical significance.*

### Scrolling performance:

```shell
# analyse scrolling performance on a long webpage
$ timeliner http://buzzfeed.com --reporter fps --sleep 5000
```

### From code:

```javascript
const timeliner = require('timeliner');

timeliner({ url: 'http://google.com' })
  .then(timeliner.reporters.basic)
  .then(timeliner.reporters.table)
  .then(result => console.log(result));
```

The reporter step can be omitted to provide the raw timeline logs to analyse as you require.

## Options

All options can be passed as flags in the command line, or as arguments in code unless otherwise specified.

### `url`

*Required* - set the page url to be loaded

### `count`

set the number of times to load the page before aggregating results - Default `5`

### `reporter`

*CLI only* - set the reporter to be used to output results - supported values: `table` (default), `basic`, `fps`, `json`

### `progress`

if set then a progress bar will be output to the console showing test execution progress

### `scroll`

if set, injects a script into the page which binds a vertical scroll to `window.requestAnimationFrame` making the page scroll continuously, recommended if using `fps` reporter - Default `false`

### `sleep`

set how long (in ms) after the page completes loading to continue recording metrics - Default `0`

### `driver`

sets the url of the webdriver remote server to use - Default `http://localhost:9515` (note: default webdriver is started automatically)

### `inject`

`Function` - allows the definition of a custom step in the webdriver promise chain. Function is passed the [webdriver](https://github.com/admc/wd) browser object as a parameter and should return a promise. See [example below](#custom-metrics).

## Custom metrics

### Using `console.timeStamp`

You can fire custom events by calling `console.timeStamp` from anywhere within your code with a label that matches `timeliner.*`. This will then report the first occurence of that event with a metric name of the wildcard portion of the timestamp label.

These can either be fired directly by the site under test, or injected as part of the test run using the `inject` option.

Example - inject some custom javascript into your page to trigger a custom event after 1 second.

```javascript
const timeliner = require('timeliner');

timeliner({
    url: 'http://example.com',
    inject: (browser) => {
      return browser.execute(`setTimeout(() => console.timeStamp('timeliner.custom-metric'), 1000);`);
    }
  })
  .then(timeliner.reporters.basic)
  .then((result) => {
    // result includes data for `custom-metric` event
    // result = { ... , 'custom-metric': { ... } }
  });
```

### In Code

You can pass an optional function to the `basic` reporter as a second argument which can execute custom metrics and output them in a form compatible with the `table` reporter.

The function should take a single set of logs as an argument and return an object keyed by metric names and with values corresponding to the value of each metric.

Example:

```javascript
const timeliner = require('timeliner');

function customMetrics (logs) {
  // value = do some big map-reduce on the logs
  return {
    'my-metric': value
  }
}

timeliner({ url: 'http://google.com' })
  .then(logs => timeliner.reporters.basic(logs, customMetrics))
  .then(timeliner.reporters.table)
  .then(result => console.log(result));
```
