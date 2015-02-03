var _ = require('./utils');

/**
 * Bitwsie and.
 * @param {State} state
 * @param {Hex} X
 * @param {Hex} Y
 * @param {Hex} Z
 * @return {Diff}
 */
exports.AND = function(state, X, Y, Z) {
  var y = _.regToUint64(Y, state);
  var z = _.regToUint64(Z, state);

  return _.build(_.genRegKey(X), _.uint64ToOcta(y.and(z)));
};

/**
 * Bitwsie and immediate.
 * @param {State} state
 * @param {Hex} X
 * @param {Hex} Y
 * @param {Hex} Z
 * @return {Diff}
 */
exports.ANDI = function(state, X, Y, Z) {
  var y = _.regToUint64(Y, state);
  var z = _.byteToUint64(Z);

  return _.build(_.genRegKey(X), _.uint64ToOcta(y.and(z)));
};

/**
 * Bitwise or.
 * @param {State} state
 * @param {Hex} X
 * @param {Hex} Y
 * @param {Hex} Z
 * @return {Diff}
 */
exports.OR = function(state, X, Y, Z) {
  var y = _.regToUint64(Y, state);
  var z = _.regToUint64(Z, state);

  return _.build(_.genRegKey(X), _.uint64ToOcta(y.or(z)));
};

/**
 * Bitwise or immediate.
 * @param {State} state
 * @param {Hex} X
 * @param {Hex} Y
 * @param {Hex} Z
 * @return {Diff}
 */
exports.ORI = function(state, X, Y, Z) {
  var y = _.regToUint64(Y, state);
  var z = _.byteToUint64(Z);

  return _.build(_.genRegKey(X), _.uint64ToOcta(y.or(z)));
};

/**
 * Bitwise xor.
 * @param {State} state
 * @param {Hex} X
 * @param {Hex} Y
 * @param {Hex} Z
 * @return {Diff}
 */
exports.XOR = function(state, X, Y, Z) {
  var y = _.regToUint64(Y, state);
  var z = _.regToUint64(Z, state);

  return _.build(_.genRegKey(X), _.uint64ToOcta(y.xor(z)));
};

/**
 * Bitwsie xor immediate.
 * @param {State} state
 * @param {Hex} X
 * @param {Hex} Y
 * @param {Hex} Z
 * @return {Diff}
 */
exports.XORI = function(state, X, Y, Z) {
  var y = _.regToUint64(Y, state);
  var z = _.byteToUint64(Z);

  return _.build(_.genRegKey(X), _.uint64ToOcta(y.xor(z)));
};

/**
 * Bitwise and-not.
 * @param {State} state
 * @param {Hex} X
 * @param {Hex} Y
 * @param {Hex} Z
 * @return {Diff}
 */
exports.ANDN = function(state, X, Y, Z) {
  var y = _.regToUint64(Y, state);
  var z = _.regToUint64(Z, state);

  return _.build(_.genRegKey(X), _.uint64ToOcta(y.and(z.not())));
};

/**
 * Bitwsie and-not immediate.
 * @param {State} stae
 * @param {Hex} X
 * @param {Hex} Y
 * @param {Hex} Z
 * @return {Diff}
 */
exports.ANDNI = function(state, X, Y, Z) {
  var y = _.regToUint64(Y, state);
  var z = _.byteToUint64(Z);

  return _.build(_.genRegKey(X), _.uint64ToOcta(y.and(z.not())));
};

/**
 * Bitwise or-not.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.ORN = function(state, X, Y, Z) {
  var y = _.regToUint64(Y, state);
  var z = _.regToUint64(Z, state);

  return _.build(_.genRegKey(X), _.uint64ToOcta(y.or(z.not())));
};

/**
 * Bitwise or-not immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.ORNI = function(state, X, Y, Z) {
  var y = _.regToUint64(Y, state);
  var z = _.byteToUint64(Z);

  return _.build(_.genRegKey(X), _.uint64ToOcta(y.or(z.not())));
};

/**
 * Bitwise not-and.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.NAND = function(state, X, Y, Z) {
  var y = _.regToUint64(Y, state);
  var z = _.regToUint64(Z, state);

  return _.build(_.genRegKey(X), _.uint64ToOcta(y.and(z).not()));
};

/**
 * Bitwise not-and immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.NANDI = function(state, X, Y, Z) {
  var y = _.regToUint64(Y, state);
  var z = _.byteToUint64(Z);

  return _.build(_.genRegKey(X), _.uint64ToOcta(y.and(z).not()));
};

/**
 * Bitwise not-or.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.NOR = function(state, X, Y, Z) {
  var y = _.regToUint64(Y, state);
  var z = _.regToUint64(Z, state);

  return _.build(_.genRegKey(X), _.uint64ToOcta(y.or(z).not()));
};

/**
 * Bitwise not-or immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.NORI = function(state, X, Y, Z) {
  var y = _.regToUint64(Y, state);
  var z = _.byteToUint64(Z);

  return _.build(_.genRegKey(X), _.uint64ToOcta(y.or(z).not()));
};

/**
 * Bitwise not-exclusive-or.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.NXOR = function(state, X, Y, Z) {
  var y = _.regToUint64(Y, state);
  var z = _.regToUint64(Z, state);

  return _.build(_.genRegKey(X), _.uint64ToOcta(y.xor(z).not()));
};

/**
 * Bitwise not-exclusive-or immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.NXORI = function(state, X, Y, Z) {
  var y = _.regToUint64(Y, state);
  var z = _.byteToUint64(Z);

  return _.build(_.genRegKey(X), _.uint64ToOcta(y.xor(z).not()));
};

/**
 * Bitwise multiplex.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.MUX = function(state, X, Y, Z) {
  var y = _.regToUint64(Y, state);
  var z = _.regToUint64(Z, state);
  var rM = _.specialToUint64('rM', state);
  var a = y.and(rM);
  var b = z.and(rM.not());

  return _.build(_.genRegKey(X), _.uint64ToOcta(a.or(b)));
};

/**
 * Bitwise multiplex immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.MUXI = function(state, X, Y, Z) {
  var y = _.regToUint64(Y, state);
  var z = _.byteToUint64(Z);
  var rM = _.specialToUint64('rM', state);
  var a = y.and(rM);
  var b = z.and(rM.not());

  return _.build(_.genRegKey(X), _.uint64ToOcta(a.or(b)));
};
