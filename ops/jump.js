/**
 * Get address. Transforms a relative address into an absolute address.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - left byte of immediate wyde constant
 * @param {Hex} Z - right byte of immediate wyde constant
 * @return {Diff}
 */
exports.GETA = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    _.RA(Y + Z, state)
  );
};

/**
 * Get address backward.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - left byte of immediate wyde constant
 * @param {Hex} Z - right byte of immediate wyde constant
 * @return {Diff}
 */
exports.GETAB = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    _.RAB(Y + Z, state)
  );
};

/**
 * Go to location.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.GO = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    _.step(state),
    '@',
    _.A(state, Y, Z)
  );
};

/**
 * Go to location immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.GOI = function(state, X, Y, Z) {
  return _.build(
    _.genRegKey(X),
    _.step(state),
    '@',
    _.AI(state, Y, Z)
  );
};

/**
 * Jump forward relative to @.
 * @param {State} state
 * @param {Hex} X - left byte of immediate triple-byte constnat
 * @param {Hex} Y - middle byte of immediate triple-byte constant
 * @param {Hex} Z - right byte of immediate triple-byte constant
 * @return {Diff}
 */
exports.JMP = function(state, X, Y, Z) {
  return _.build('@', _.RA(X + Y + Z, state));
};

/**
 * Jump backward relative to @.
 * @param {State} state
 * @param {Hex} X - left byte of immediate triple-byte constnat
 * @param {Hex} Y - middle byte of immediate triple-byte constant
 * @param {Hex} Z - right byte of immediate triple-byte constant
 * @return {Diff}
 */
exports.JMPB = function(state, X, Y, Z) {
  return _.build('@', _.RAB(X + Y + Z, state));
};
