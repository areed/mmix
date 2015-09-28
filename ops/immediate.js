var _ = require('../utils');
var Big = require('big.js');
var Long = require('long');

var two = Big(2);

/**
 * Set high wyde.
 * @param {State}
 * @param {Hex} X - destination register
 * @param {Hex} Y - left half of immediate wyde constant
 * @param {Hex} Z - right half of immediate wyde constant
 * @return {Diff}
 */
exports.SETH = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    Y + Z + '000000000000'
  );
};

/**
 * Set medium high wyde.
 * @param {State}
 * @param {Hex} X - destination register
 * @param {Hex} Y - left half of immediate wyde constant
 * @param {Hex} Z - right half of immediate wyde constant
 * @return {Diff}
 */
exports.SETMH = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    '0000' + Y + Z + '00000000'
  );
};

/**
 * Set medium low wyde.
 * @param {State}
 * @param {Hex} X - destination register
 * @param {Hex} Y - left half of immediate wyde constant
 * @param {Hex} Z - right half of immediate wyde constant
 * @return {Diff}
 */
exports.SETML = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    '00000000' + Y + Z + '0000'
  );
};

/**
 * Set low wyde.
 * @param {State}
 * @param {Hex} X - destination register
 * @param {Hex} Y - left half of immediate wyde constant
 * @param {Hex} Z - right half of immediate wyde constant
 * @return {Diff}
 */
exports.SETL = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    '000000000000' + Y + Z
  );
};

/**
 * Increase by high wyde.
 * @param {State}
 * @param {Hex} X - source and destination register
 * @param {Hex} Y - left half of immediate wyde constant
 * @param {Hex} Z - right half of immediate wyde constant
 * @return {Diff}
 */
exports.INCH = function(state, X, Y, Z) {
  var yz = Big(_.decify(Y + Z, 16)).times(two.pow(48));

  return _.build(
    _.genRegKey(X),
    _.hexify64U(_.regUint64(X, state).plus(yz).mod(_.twoToThe64th))
  );
};

/**
 * Increase by medium high wyde.
 * @param {State}
 * @param {Hex} X - source and destination register
 * @param {Hex} Y - left half of immediate wyde constant
 * @param {Hex} Z - right half of immediate wyde constant
 * @return {Diff}
 */
exports.INCMH = function(state, X, Y, Z) {
  var yz = Big(_.decify(Y + Z, 16)).times(two.pow(32));

  return _.build(
    _.genRegKey(X),
    _.hexify64U(_.regUint64(X, state).plus(yz).mod(_.twoToThe64th))
  );
}

/**
 * Increase by medium high wyde.
 * @param {State}
 * @param {Hex} X - source and destination register
 * @param {Hex} Y - left half of immediate wyde constant
 * @param {Hex} Z - right half of immediate wyde constant
 * @return {Diff}
 */
exports.INCML = function(state, X, Y, Z) {
  var yz = Big(_.decify(Y + Z, 16)).times(two.pow(16));

  return _.build(
    _.genRegKey(X),
    _.hexify64U(_.regUint64(X, state).plus(yz).mod(_.twoToThe64th))
  );
};

/**
 * Increase by medium high wyde.
 * @param {State}
 * @param {Hex} X - source and destination register
 * @param {Hex} Y - left half of immediate wyde constant
 * @param {Hex} Z - right half of immediate wyde constant
 * @return {Diff}
 */
exports.INCL = function(state, X, Y, Z) {
  var yz = Big(_.decify(Y + Z, 16));

  return _.build(
    _.genRegKey(X),
    _.hexify64U(_.regUint64(X, state).plus(yz).mod(_.twoToThe64th))
  );
};

/**
 * Bitwise or with high wyde.
 * @param {State}
 * @param {Hex} X - source and destination register
 * @param {Hex} Y - left half of immediate wyde constant
 * @param {Hex} Z - right half of immediate wyde constant
 * @return {Diff}
 */
exports.ORH = function(state, X, Y, Z) {
  var yz = Long.fromString(Y + Z, true, 16).shiftLeft(48);
  var x = _.regToUint64(X, state);

  return _.build(
    _.genRegKey(X),
    _.uint64ToOcta(yz.or(x))
  );
};

/**
 * Bitwise or with medium high wyde.
 * @param {State}
 * @param {Hex} X - source and destination register
 * @param {Hex} Y - left half of immediate wyde constant
 * @param {Hex} Z - right half of immediate wyde constant
 * @return {Diff}
 */
exports.ORMH = function(state, X, Y, Z) {
  var yz = Long.fromString(Y + Z, true, 16).shiftLeft(32);
  var x = _.regToUint64(X, state);

  return _.build(
    _.genRegKey(X),
    _.uint64ToOcta(yz.or(x))
  );
};

/**
 * Bitwise or with medium low wyde.
 * @param {State}
 * @param {Hex} X - source and destination register
 * @param {Hex} Y - left half of immediate wyde constant
 * @param {Hex} Z - right half of immediate wyde constant
 * @return {Diff}
 */
exports.ORML = function(state, X, Y, Z) {
  var yz = Long.fromString(Y + Z, true, 16).shiftLeft(16);
  var x = _.regToUint64(X, state);

  return _.build(
    _.genRegKey(X),
    _.uint64ToOcta(yz.or(x))
  );
};

/**
 * Bitwise or with medium low wyde.
 * @param {State}
 * @param {Hex} X - source and destination register
 * @param {Hex} Y - left half of immediate wyde constant
 * @param {Hex} Z - right half of immediate wyde constant
 * @return {Diff}
 */
exports.ORL = function(state, X, Y, Z) {
  var yz = Long.fromString(Y + Z, true, 16);
  var x = _.regToUint64(X, state);

  return _.build(
    _.genRegKey(X),
    _.uint64ToOcta(yz.or(x))
  );
};

/**
 * Bitwise and-not high wyde.
 * @param {State}
 * @param {Hex} X - source and destination register
 * @param {Hex} Y - left half of immediate wyde constant
 * @param {Hex} Z - right half of immediate wyde constant
 * @return {Diff}
 */
exports.ANDNH = function(state, X, Y, Z) {
  var yz = Long.fromString(Y + Z, true, 16).shiftLeft(48);
  var x = _.regToUint64(X, state);

  return _.build(
    _.genRegKey(X),
    _.uint64ToOcta(x.and(yz.not()))
  );
};

/**
 * Bitwise and-not medium high wyde.
 * @param {State}
 * @param {Hex} X - source and destination register
 * @param {Hex} Y - left half of immediate wyde constant
 * @param {Hex} Z - right half of immediate wyde constant
 * @return {Diff}
 */
exports.ANDNMH = function(state, X, Y, Z) {
  var yz = Long.fromString(Y + Z, true, 16).shiftLeft(32);
  var x = _.regToUint64(X, state);

  return _.build(
    _.genRegKey(X),
    _.uint64ToOcta(x.and(yz.not()))
  );
};

/**
 * Bitwise and-not medium low wyde.
 * @param {State}
 * @param {Hex} X - source and destination register
 * @param {Hex} Y - left half of immediate wyde constant
 * @param {Hex} Z - right half of immediate wyde constant
 * @return {Diff}
 */
exports.ANDNML = function(state, X, Y, Z) {
  var yz = Long.fromString(Y + Z, true, 16).shiftLeft(16);
  var x = _.regToUint64(X, state);

  return _.build(
    _.genRegKey(X),
    _.uint64ToOcta(x.and(yz.not()))
  );
};

/**
 * Bitwise and-not low wyde.
 * @param {State}
 * @param {Hex} X - source and destination register
 * @param {Hex} Y - left half of immediate wyde constant
 * @param {Hex} Z - right half of immediate wyde constant
 * @return {Diff}
 */
exports.ANDNL = function(state, X, Y, Z) {
  var yz = Long.fromString(Y + Z, true, 16);
  var x = _.regToUint64(X, state);

  return _.build(
    _.genRegKey(X),
    _.uint64ToOcta(x.and(yz.not()))
  );
};
