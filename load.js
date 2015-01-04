var _ = require('./utils');

/**
 * Load a byte from memory at the address obtained by casting the octabytes in
 * $Y and $Z to unsigned integers and summing them. Place the sign-extend byte
 * into register $X.
 * @function
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 */
exports.LDB = function(state, X, Y, Z) {
  var diff = {};

  diff[_.genRegKey(X)] = _.signExtend8To64(state[_.A(state, Y, Z)]);

  return diff;
};

/**
 * Immediate version of LDB.
 * @param {State} state
 * @param {Hex} X
 * @param {Hex} Y
 * @param {Hex} Z - immediate byte constant
 */
exports.LDBI = function(state, X, Y, Z) {
  var diff = {};

  diff[_.genRegKey(X)] = _.signExtend8To64(state[_.AI(state, Y, Z)]);

  return diff;
};

/**
 * Same as LDB but without sign-extension.
 * @param {Hex} X
 * @param {Hex} Y
 * @param {Hex} Z
 */
exports.LDBU = function(state, X, Y, Z) {
  var diff = {};

  diff[_.genRegKey(X)] = _.extendUnsignedTo64(state[_.AI(state, Y, Z)]);

  return diff;
};

/**
 * Immediate version of LDBU.
 * @param {Hex} X
 * @param {Hex} Y
 * @param {Hex} Z
 */
exports.LDBUI = function(state, X, Y, Z) {
  var diff = {};

  diff[_.genRegKey(X)] = _.extendUnsignedTo64(state[_.AI(state, Y, Z)]);

  return diff;
};

/**
 * Analogous to LDB loading a wyde from the calculated memory address.
 * @param {Hex} X
 * @param {Hex} Y
 * @param {Hex} Z
 */
exports.LDW = function(state, X, Y, Z) {
  var diff = {};

  var address = _.A(state, Y, Z);

  diff[_.genRegKey(X)] = _.signExtend16To64(state[address] + state[address]);

  return diff;
};
