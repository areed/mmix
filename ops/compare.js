var _ = require('../utils');

/**
 * Compare.
 * @param {State} state
 * @param {Hex} X - destination register, will be -1, 0, or 1
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.CMP = function(state, X, Y, Z) {
  var y64 = _.regToInt64(Y, state);
  var z64 = _.regToInt64(Z, state);
  var cmp = y64.compare(z64);

  switch (y64.compare(z64)) {
  case -1:
    return _.build(_.genRegKey(X), 'FFFFFFFFFFFFFFFF');
  case 0:
    return _.build(_.genRegKey(X), '0000000000000000');
  default:
    return _.build(_.genRegKey(X), '0000000000000001');
  }
};

/**
 * Compare immediate.
 * @param {Hex} X - destination register, will be -1, 0, or 1
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.CMPI = function(state, X, Y, Z) {
  var y64 = _.regToInt64(Y, state);
  var z64 = _.byteToInt64(Z, state);
  var cmp = y64.compare(z64);

  switch (y64.compare(z64)) {
  case -1:
    return _.build(_.genRegKey(X), 'FFFFFFFFFFFFFFFF');
  case 0:
    return _.build(_.genRegKey(X), '0000000000000000');
  default:
    return _.build(_.genRegKey(X), '0000000000000001');
  }
};

/**
 * Compare unsigned.
 * @param {State} state
 * @param {Hex} X - destination register, will be -1, 0, or 1
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.CMPU = function(state, X, Y, Z) {
  var y64 = _.regToUint64(Y, state);
  var z64 = _.regToUint64(Z, state);
  var cmp = y64.compare(z64);

  switch (y64.compare(z64)) {
  case -1:
    return _.build(_.genRegKey(X), 'FFFFFFFFFFFFFFFF');
  case 0:
    return _.build(_.genRegKey(X), '0000000000000000');
  default:
    return _.build(_.genRegKey(X), '0000000000000001');
  }
};

/**
 * Compare unsigned immediate.
 * @param {State} state
 * @param {Hex} X - destination register, will be -1, 0, or 1
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.CMPUI = function(state, X, Y, Z) {
  var y64 = _.regToUint64(Y, state);
  var z64 = _.byteToUint64(Z);
  var cmp = y64.compare(z64);

  switch (y64.compare(z64)) {
  case -1:
    return _.build(_.genRegKey(X), 'FFFFFFFFFFFFFFFF');
  case 0:
    return _.build(_.genRegKey(X), '0000000000000000');
  default:
    return _.build(_.genRegKey(X), '0000000000000001');
  }
};
