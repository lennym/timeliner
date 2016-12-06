function zip (data) {
  return data.reduce((lists, run) => {
    run.forEach((logs, i) => {
      lists[i] = lists[i] || [];
      lists[i].push(logs);
    });
    return lists;
  }, []);
}

module.exports = zip;
