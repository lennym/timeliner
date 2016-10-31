module.exports = function (n) {
  const arr = [];
  while (arr.length < n) {
    arr.push(arr.length);
  }
  return arr;
};
