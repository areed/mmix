var Big = require('big.js');

/**
 * @param {ByteWidth} byteWidth
 * @param {Uint} addr
 * @return {Uint}
 */
exports.effectiveAddress = function(byteWidth, addr) {
  return addr.minus(addr.mod(byteWidth));
};

/**
 * @param {Int} n
 * @return {Int}
 */
var quotient = exports.quotient = function(divisor, n) {
  var q = n.div(divisor);

  return n.cmp(0) === -1 ? q.round(0, 3) : q.round(0, 0);
};

/**
 * @param {Int} divisor
 * @param {Int} n
 * @return {Int}
 */
exports.remainder = function(divisor, n) {
  var q = quotient(divisor, n);

  return n.minus(q.times(divisor));
};
