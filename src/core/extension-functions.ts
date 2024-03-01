Array.prototype.getFirstOrFail = function () {
  const first = this[0];
  if (first == null) throw new Error('Null Value at first index');

  return first;
};
