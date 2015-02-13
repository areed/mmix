var _ = require('./utils');

/**
 * Conditionally set if negative.
 * @param {State} state
 * @param {Hex} X - destination register maybe
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.CSN = function(state, X, Y, Z) {
  return _.regIsNeg(Y, state) ?
    _.build(_.genRegKey(X), _.genRegOcta(Z, state)) : {};
};

/**
 * Conditionally set if negative immediate.
 * @param {State} state
 * @param {Hex} X - destination register maybe
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.CSNI = function(state, X, Y, Z) {
  return _.regIsNeg(Y, state) ?
    _.build(_.genRegKey(X), _.extendUnsignedTo64(Z)) : {};
};

/**
 * Conditionally set if zero.
 * @param {State} state
 * @param {Hex} X - destination register maybe
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.CSZ = function(state, X, Y, Z) {
  return _.regIsZero(Y, state) ?
    _.build(_.genRegKey(X), _.genRegOcta(Z, state)) : {};
};

/**
 * Conditionally set if zero immediate.
 * @param {State} state
 * @param {Hex} X - destination register maybe
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.CSZI = function(state, X, Y, Z) {
  return _.regIsZero(Y, state) ?
    _.build(_.genRegKey(X), _.extendUnsignedTo64(Z)) : {};
};

/**
 * Conditionally set if positive.
 * @param {State} state
 * @param {Hex} X - destination register maybe
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.CSP = function(state, X, Y, Z) {
  return _.regIsPos(Y, state) ?
    _.build(_.genRegKey(X), _.genRegOcta(Z, state)) : {};
};

/**
 * Conditionally set if positive immediate.
 * @param {State} state
 * @param {Hex} X - destination register maybe
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.CSPI = function(state, X, Y, Z) {
  return _.regIsPos(Y, state) ?
    _.build(_.genRegKey(X), _.extendUnsignedTo64(Z)) : {};
};

/**
 * Conditionally set if odd.
 * @param {State} state
 * @param {Hex} X - destination register maybe
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.CSOD = function(state, X, Y, Z) {
  return _.regIsOdd(Y, state) ?
    _.build(_.genRegKey(X), _.genRegOcta(Z, state)) : {};
};

/**
 * Conditionally set if odd immediate.
 * @param {State} state
 * @param {Hex} X - destination register maybe
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 */
exports.CSODI = function(state, X, Y, Z) {
  return _.regIsOdd(Y, state) ?
    _.build(_.genRegKey(X), _.extendUnsignedTo64(Z)) : {};
};

/**
 * Conditionally set if nonnegative.
 * @param {State} state
 * @param {Hex} X - destination register maybe
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.CSNN = function(state, X, Y, Z) {
  return _.regIsNeg(Y, state) ?
    {} : _.build(_.genRegKey(X), _.genRegOcta(Z, state));
};

/**
 * Conditionally set if nonnegative immediate.
 * @param {State} state
 * @param {Hex} X - destination register maybe
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.CSNNI = function(state, X, Y, Z) {
  return _.regIsNeg(Y, state) ?
    {} : _.build(_.genRegKey(X), _.extendUnsignedTo64(Z));
};

/**
 * Conditionally set if nonzero.
 * @param {State} state
 * @param {Hex} X - destination register maybe
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.CSNZ = function(state, X, Y, Z) {
  return _.regIsZero(Y, state) ?
    {} : _.build(_.genRegKey(X), _.genRegOcta(Z, state));
};

/**
 * Conditionally set if nonzero immediate.
 * @param {State} state
 * @param {Hex} X - destination register maybe
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.CSNZI = function(state, X, Y, Z) {
  return _.regIsZero(Y, state) ?
    {} : _.build(_.genRegKey(X), _.extendUnsignedTo64(Z));
};

/**
 * Conditionally set if nonpositive.
 * @param {State} state
 * @param {Hex} X - destination register maybe
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.CSNP = function(state, X, Y, Z) {
  return _.regIsPos(Y, state) ?
    {} : _.build(_.genRegKey(X), _.genRegOcta(Z, state));
};

/**
 * Conditionally set if nonpositive immediate.
 * @param {State} state
 * @param {Hex} X - destination register maybe
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.CSNPI = function(state, X, Y, Z) {
  return _.regIsPos(Y, state) ?
    {} : _.build(_.genRegKey(X), _.extendUnsignedTo64(Z));
};

/**
 * Conditionally set if even.
 * @param {State} state
 * @param {Hex} X - destination register maybe
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.CSEV = function(state, X, Y, Z) {
  return _.regIsOdd(Y, state) ?
    {} : _.build(_.genRegKey(X), _.genRegOcta(Z, state));
};

/**
 * Conditionally set if even immediate.
 * @param {State} state
 * @param {Hex} X - destination register maybe
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.CSEVI = function(state, X, Y, Z) {
  return _.regIsOdd(Y, state) ?
    {} : _.build(_.genRegKey(X), _.extendUnsignedTo64(Z));
};

/**
 * Zero or set if negative.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.ZSN = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    _.regIsNeg(Y, state) ? _.genRegOcta(Z, state) : _.ZEROS
  );
};

/**
 * Zero or set if negative immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.ZSNI = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    _.regIsNeg(Y, state) ? _.extendUnsignedTo64(Z) : _.ZEROS
  );
};

/**
 * Zero or set if zero.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.ZSZ = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    _.regIsZero(Y, state) ? _.genRegOcta(Z, state) : _.ZEROS
  );
};

/**
 * Zero or set if zero immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.ZSZI = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    _.regIsZero(Y, state) ? _.extendUnsignedTo64(Z) : _.ZEROS
  );
};

/**
 * Zero or set if positive.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.ZSP = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    _.regIsPos(Y, state) ? _.genRegOcta(Z, state) : _.ZEROS
  );
};

/**
 * Zero or set if positive immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.ZSPI = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    _.regIsPos(Y, state) ? _.extendUnsignedTo64(Z) : _.ZEROS
  );
};

/**
 * Zero or set if odd.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.ZSOD = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    _.regIsOdd(Y, state) ? _.genRegOcta(Z, state) : _.ZEROS
  );
};

/**
 * Zero or set if odd immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.ZSODI = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    _.regIsOdd(Y, state) ? _.extendUnsignedTo64(Z) : _.ZEROS
  );
};

/**
 * Zero or set if nonnegative.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.ZSNN = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    _.regIsNeg(Y, state) ? _.ZEROS : _.genRegOcta(Z, state)
  );
};

/**
 * Zero or set if nonnegative immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.ZSNNI = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    _.regIsNeg(Y, state) ? _.ZEROS : _.extendUnsignedTo64(Z, state)
  );
};

/**
 * Zero or set if nonzero.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.ZSNZ = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    _.regIsZero(Y, state) ? _.ZEROS : _.genRegOcta(Z, state)
  );
};

/**
 * Zero or set if nonzero immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.ZSNZI = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    _.regIsZero(Y, state) ? _.ZEROS : _.extendUnsignedTo64(Z, state)
  );
};

/**
 * Zero or set if nonpositive.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.ZSNP = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    _.regIsPos(Y, state) ? _.ZEROS : _.genRegOcta(Z, state)
  );
};

/**
 * Zero or set if nonpositive immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.ZSNPI = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    _.regIsPos(Y, state) ? _.ZEROS : _.extendUnsignedTo64(Z, state)
  );
};

/**
 * Zero or set if even.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.ZSEV = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    _.regIsOdd(Y, state) ? _.ZEROS : _.genRegOcta(Z, state)
  );
};

/**
 * Zero or set if even immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.ZSEVI = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    _.regIsOdd(Y, state) ? _.ZEROS : _.extendUnsignedTo64(Z, state)
  );
};
