const babar = require('babar');

function chart (data, url) {
  const series = data.map((fps, i) => {
    return [i, fps];
  });
  return babar(series, { caption: `scrolling fps - ${url}`, height: 12, minY: 1, maxY: 60 });
}

function fps (data) {
  const result = data
      .filter((l) => {
        return l.message.message.params.name === 'OnSwapCompositorFrame';
      })
      .reduce((groups, l) => {
        const group = Math.floor(l.timestamp);
        groups[group] = groups[group] || [];
        groups[group].push(l);
        return groups;
      }, [])
      .map((group) => group.length);

  result.pop();

  for (var i = 0; i < result.length; i++) {
    result[i] = result[i] || 0;
  }

  return result;
}

module.exports = function (data) {
  return Object.keys(data).map((key) => {
    const d = data[key];
    return d.map(run => chart(fps(run), key));
  });
};
