var Big = require('big.js');
var _ = require('../utils');

/**
 * Shift left.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
var SL = exports.SL = function(state, X, Y, Z) {
  var yInt = _.regToInt(Y, state);
  var zUint = _.regToUint64(Z, state);
  var xInt = yInt.times(Big(2).pow(parseInt(zUint.toString(10), 10)));
  var diff = _.build(
    _.genRegKey(X),
    _.hexify64(xInt)
  );

  return _.bigOverflows64(xInt) ? _.extend({'exceptions': '01000000'}, diff) : diff;
};

/**
 * Shift left immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
var SLI = exports.SLI = function(state, X, Y, Z) {
  var yInt = _.regToInt(Y, state);
  var zUint = _.byteToUint(Z, state);
  var xInt = yInt.times(Big(2).pow(zUint));
  var diff = _.build(
    _.genRegKey(X),
    xInt
  );

  return _.bigOverflows64(xInt) ? _.extend({'exceptions': '01000000'}, diff) : diff;
};

/**
 * Shift left unsigned.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.SLU = function(state, X, Y, Z) {
  return _.omit(['exceptions'], SL(state, X, Y, Z));
};

/**
 * Shift left unsigned immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.SLUI = function(state, X, Y, Z) {
  return _.omit(['exceptions'], SLI(state, X, Y, Z));
};

/**
 * Shift right.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.SR = function(state, X, Y, Z) {
  var yInt = _.regToInt(Y, state);
  var zUint = _.regToUint(Z, state);
  var xInt = _.quotient(Big(2).pow(zUint), yInt);
  var diff = _.build(
    _.genRegKey(X),
    _.hexify64(xInt)
  );

  return bigOverflows64(xInt) ? _.extend({exceptions: '01000000'}, diff) : diff;
};
  
/**
 * Shift right immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.SRI = function(state, X, Y, Z) {
  var yInt = _.regToInt(Y, state);
  var zUint = _.byteToUint(Z);
  var xInt = _.quotient(Big(2).pow(zUint), yInt);
  var diff = _.build(
    _.genRegKey(X),
    _.hexify64(xInt)
  );

  return bigOverflows64(xInt) ? _.extend({exceptions: '01000000'}, diff) : diff;
};

/**
 * Shift right unsigned.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.SRU = function(state, X, Y, Z) {
  var yUint = _.regToUint(Y, state);
  var zUint = _.regToUint(Z, state);
  var xUint = _.quotient(Big(2).pow(zUint), yUint);

  return _.build(
    _.genRegKey(X),
    _.hexify64(xUint)
  );
};

/**
 * Shift right unsigned immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immedite byte constant
 * @return {Diff}
 */
exports.SRUI = function(state, X, Y, Z) {
  var yUint = _.regToUint(Y, state);
  var zUint = _.byteToUint(Z, state);
  var xUint = _.quotient(Big(2).pow(zUint), yUint);

  return _.build(
    _.genRegKey(X),
    _.hexify64(xUint)
  );
};
