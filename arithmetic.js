var _ = require('./utils');

var modTwo64th = _.compose(_.octafyBig, _.curry(_.remainder, _.twoToThe64th));

/**
 * Set $X to the sum of the signed octabytes in $Y and $Z.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
var ADD = exports.ADD = function(state, X, Y, Z) {
  var bigX = _.regToInt(Y, state).plus(_.regToInt(Z, state));
  var diff = _.build(_.genRegKey(X), modTwo64th(bigX));

  return _.bigOverflows64(bigX) ? _.extend({exceptions: '01000000'}, diff) : diff;
};

/**
 * Set $X to the sum of the signed octabyte in $Y and the immediate byte
 * constant Z.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
var ADDI = exports.ADDI = function(state, X, Y, Z) {
  var bigX = _.regToInt(Y, state).plus(_.byteToUint(Z));
  var diff = _.build(_.genRegKey(X), modTwo64th(bigX));

  return _.bigOverflows64(bigX) ? _.extend({exceptions: '01000000'}, diff) : diff;
};

/**
 * Set $X to the sum of the signed octabytes in $Y and $Z without overflow.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Y - source register
 * @return {Diff}
 */
exports.ADDU = function(state, X, Y, Z) {
  return _.omit(['exceptions'], ADD(state, X, Y, Z));
};

/**
 * Set $X to the sum of the signed octabyte in $Y and the immediate byte
 * constant Z without overflow.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.ADDUI = function(state, X, Y, Z) {
  return _.omit(['exceptions'], ADDI(state, X, Y, Z));
};

/**
 * Set $X to the difference of the signed octabytes in $Y - $Z.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
var SUB = exports.SUB = function(state, X, Y, Z) {
  var bigX = _.regToInt(Y, state).minus(_.regToInt(Z, state));
  var diff = _.build(_.genRegKey(X), modTwo64th(bigX));

  return _.bigOverflows64(bigX) ? _.extend({exceptions: '01000000'}, diff) : diff;
};

/**
 * Set $X to the difference of the signed octabytes in $Y - $Z.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
var SUBI = exports.SUBI = function(state, X, Y, Z) {
  var bigX = _.regToInt(Y, state).minus(_.byteToUint(Z));
  var diff = _.build(_.genRegKey(X), modTwo64th(bigX));

  return _.bigOverflows64(bigX) ? _.extend({exceptions: '01000000'}, diff) : diff;
};

/**
 * Same as SUB without overflow check.
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.SUBU = function(state, X, Y, Z) {
  return _.omit(['exceptions'], SUB(state, X, Y, Z));
};

/**
 * Same as SUBI without overflow check.
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.SUBUI = function(state, X, Y, Z) {
  return _.omit(['exceptions'], SUBI(state, X, Y, Z));
};

/**
 * Times 2 and add unsigned.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports['2ADDU'] = function(state, X, Y, Z) {
  var bigX = _.regToInt(Y, state).times(2).plus(_.regToInt(Z, state));
  
  return _.build(_.genRegKey(X), modTwo64th(bigX));
};

/**
 * Times 2 and add unsigned immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports['2ADDUI'] = function(state, X, Y, Z) {
  var bigX = _.regToInt(Y, state).times(2).plus(_.byteToUint(Z));

  return _.build(_.genRegKey(X), modTwo64th(bigX));
};

/**
 * Times 4 and add unsigned.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports['4ADDU'] = function(state, X, Y, Z) {
  var bigX = _.regToInt(Y, state).times(4).plus(_.regToInt(Z));

  return _.build(_.genRegKey(X), modTwo64th(bigX));
};

/**
 * Times 4 and add unsigned immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports['4ADDUI'] = function(state, X, Y, Z) {
  var bigX = _.regToInt(Y, state).times(4).plus(_.byteToUint(Z));

  return _.build(_.genRegKey(X), modTwo64th(bigX));
};

/**
 * Times 8 and add unsigned.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports['8ADDU'] = function(state, X, Y, Z) {
  var bigX = _.regToInt(Y, state).times(8).plus(_.regToInt(Z));

  return _.build(_.genRegKey(X), modTwo64th(bigX));
};

/**
 * Times 8 and add unsigned immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports['8ADDUI'] = function(state, X, Y, Z) {
  var bigX = _.regToInt(Y, state).times(8).plus(_.byteToUint(Z));

  return _.build(_.genRegKey(X), modTwo64th(bigX));
};

/**
 * Times 16 and add unsigned.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports['16ADDU'] = function(state, X, Y, Z) {
  var bigX = _.regToInt(Y, state).times(16).plus(_.regToInt(Z));

  return _.build(_.genRegKey(X), modTwo64th(bigX));
};

/**
 * Times 16 and add unsigned immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports['16ADDUI'] = function(state, X, Y, Z) {
  var bigX = _.regToInt(Y, state).times(16).plus(_.byteToUint(Z));

  return _.build(_.genRegKey(X), modTwo64th(bigX));
};

/**
 * Negate signed.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - immediate byte constant, usually 00
 * @param {Hex} Z - source register
 * @return {Diff}
 */
var NEG = exports.NEG = function(state, X, Y, Z) {
  var bigX = _.byteToUint(Y).minus(_.regToInt(Z, state));
  var diff = _.build(_.genRegKey(X), modTwo64th(bigX));

  return _.bigOverflows64(bigX) ? _.extend({'exceptions': '01000000'}, diff) : diff;
};

/**
 * Negate signed immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - immediate byte constant
 * @param {Hex} Z - immediate byte constant
 */
var NEGI = exports.NEGI = function(state, X, Y, Z) {
  var bigX = _.byteToUint(Y).minus(_.byteToUint(Z));
  var diff = _.build(_.genRegKey(X), modTwo64th(bigX));

  return _.bigOverflows64(bigX) ? _.extend({'exceptions': '01000000'}, diff) : diff;
};

/**
 * Negate unsigned.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - immediate byte constant
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.NEGU = function(state, X, Y, Z) {
  return _.omit(['exceptions'], NEG(state, X, Y, Z));
};

/**
 * Negate unsigned immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - immediate byte constant
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.NEGUI = function(state, X, Y, Z) {
  return _.omit(['exceptions'], NEGI(state, X, Y, Z));
};
