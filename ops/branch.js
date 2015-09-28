var _ = require('../utils');

/**
 * Branch forward if negative.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - left hand byte of immediate wyde constant
 * @param {Hex} Z - right hand byte of immediate wyde constant
 * @return {Diff}
 */
exports.BN = function(state, X, Y, Z) {
  return _.regIsNeg(X, state) ? _.build('@', _.RA(Y + Z, state)) : {};
};

/**
 * Branch backward if negative.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - left hand byte of immediate wyde constant
 * @param {Hex} Z - right hand byte of immediate wyde constant
 * @return {Diff}
 */
exports.BNB = function(state, X, Y, Z) {
  return _.regIsNeg(X, state) ? _.build('@', _.RAB(Y + Z, state)) : {};
};

/**
 * Branch forward if zero.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - left byte of immediate wyde constant
 * @param {Hex} Z - right byte of immediate wyde constant
 * @return {Diff}
 */
exports.BZ = function(state, X, Y, Z) {
  return _.regIsZero(X, state) ? _.build('@', _.RA(Y + Z, state)) : {};
};

/**
 * Branch backward if zero.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - left byte of immediate wyde constant
 * @param {Hex} Z - right byte of immediate wyde constant
 * @return {Diff}
 */
exports.BZB = function(state, X, Y, Z) {
  return _.regIsZero(X, state) ? _.build('@', _.RAB(Y + Z, state)) : {};
};

/**
 * Branch forward if positive.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - left byte of immediate wyde constant
 * @param {Hex} Z - right byte of immediate wyde constant
 * @return {Diff}
 */
exports.BP = function(state, X, Y, Z) {
  return _.regIsPos(X, state) ? _.build('@', _.RA(Y + Z, state)) : {};
};

/**
 * Branch backward if positive.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - left byte of immediate wyde constant
 * @param {Hex} Z - right byte of immediate wyde constant
 * @return {Diff}
 */
exports.BPB = function(state, X, Y, Z) {
  return _.regIsPos(X, state) ? _.build('@', _.RAB(Y + Z, state)) : {};
};

/**
 * Branch forward if odd.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - left byte of immediate wyde constant
 * @param {Hex} Z - right byte of immediate wyde constant
 * @return {Diff}
 */
exports.BOD = function(state, X, Y, Z) {
  return _.regIsOdd(X, state) ? _.build('@', _.RA(Y + Z, state)) : {};
};

/**
 * Branch backward if odd.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - left byte of immediate wyde constant
 * @param {Hex} Z - right byte of immediate wyde constant
 * @return {Diff}
 */
exports.BODB = function(state, X, Y, Z) {
  return _.regIsOdd(X, state) ? _.build('@', _.RAB(Y + Z, state)) : {};
};

/**
 * Branch forward if nonnegative.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - left hand byte of immediate wyde constant
 * @param {Hex} Z - right hand byte of immediate wyde constant
 * @return {Diff}
 */
exports.BNN = function(state, X, Y, Z) {
  return _.regIsNeg(X, state) ? {} : _.build('@', _.RA(Y + Z, state));
};

/**
 * Branch backward if nonnegative.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - left hand byte of immediate wyde constant
 * @param {Hex} Z - right hand byte of immediate wyde constant
 * @return {Diff}
 */
exports.BNNB = function(state, X, Y, Z) {
  return _.regIsNeg(X, state) ? {} : _.build('@', _.RAB(Y + Z, state));
};

/**
 * Branch forward if nonzero.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - left byte of immediate wyde constant
 * @param {Hex} Z - right byte of immediate wyde constant
 * @return {Diff}
 */
exports.BNZ = function(state, X, Y, Z) {
  return _.regIsZero(X, state) ? {} : _.build('@', _.RA(Y + Z, state));
};

/**
 * Branch backward if nonzero.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - left byte of immediate wyde constant
 * @param {Hex} Z - right byte of immediate wyde constant
 * @return {Diff}
 */
exports.BNZB = function(state, X, Y, Z) {
  return _.regIsZero(X, state) ? {} :  _.build('@', _.RAB(Y + Z, state));
};

/**
 * Branch forward if nonpositive.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - left byte of immediate wyde constant
 * @param {Hex} Z - right byte of immediate wyde constant
 * @return {Diff}
 */
exports.BNP = function(state, X, Y, Z) {
  return _.regIsPos(X, state) ? {} : _.build('@', _.RA(Y + Z, state));
};

/**
 * Branch backward if nonpositive.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - left byte of immediate wyde constant
 * @param {Hex} Z - right byte of immediate wyde constant
 * @return {Diff}
 */
exports.BNPB = function(state, X, Y, Z) {
  return _.regIsPos(X, state) ? {} :  _.build('@', _.RAB(Y + Z, state));
};

/**
 * Branch forward if even.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - left byte of immediate wyde constant
 * @param {Hex} Z - right byte of immediate wyde constant
 * @return {Diff}
 */
exports.BEV = function(state, X, Y, Z) {
  return _.regIsOdd(X, state) ? {} :  _.build('@', _.RA(Y + Z, state));
};

/**
 * Branch backward if even.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - left byte of immediate wyde constant
 * @param {Hex} Z - right byte of immediate wyde constant
 * @return {Diff}
 */
exports.BEVB = function(state, X, Y, Z) {
  return _.regIsOdd(X, state) ? {} : _.build('@', _.RAB(Y + Z, state));
};
