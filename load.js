var _ = require('./utils');

var loadPadByte = _.compose(_.signExtend8To64, _.loadByte);
var loadPadByteU = _.compose(_.extendUnsignedTo64, _.loadByte);

var loadPadWyde = _.compose(_.signExtend16To64, _.loadWyde);
var loadPadWydeU = _.compose(_.extendUnsignedTo64, _.loadWyde);

var loadPadTetra = _.compose(_.signExtend32To64, _.loadTetra);
var loadPadTetraU = _.compose(_.extendUnsignedTo64, _.loadTetra);

/**
 * Load a byte from memory at the address obtained by casting the octabytes in
 * $Y and $Z to unsigned integers and summing them. Place the sign-extend byte
 * into register $X.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.LDB = function(state, X, Y, Z) {
  return _.build(_.genRegKey(X), loadPadByte(_.A(state, Y, Z), state));
};

/**
 * Immediate version of LDB.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.LDBI = function(state, X, Y, Z) {
  return _.build(_.genRegKey(X), loadPadByte(_.AI(state, Y, Z), state));
};

/**
 * Same as LDB but without sign-extension.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.LDBU = function(state, X, Y, Z) {
  return _.build(_.genRegKey(X), loadPadByteU(_.A(state, Y, Z), state));
};

/**
 * Immediate version of LDBU.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.LDBUI = function(state, X, Y, Z) {
  return _.build(_.genRegKey(X), loadPadByteU(_.AI(state, Y, Z), state));
};

/**
 * Same as LDB but loads a wyde.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.LDW = function(state, X, Y, Z) {
  return _.build(_.genRegKey(X), loadPadWyde(_.A(state, Y, Z), state));
};

/**
 * Load wyde immediate signed.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.LDWI = function(state, X, Y, Z) {
  return _.build(_.genRegKey(X), loadPadWyde(_.AI(state, Y, Z), state));
};

/**
 * Load wyde unsigned.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.LDWU = function(state, X, Y, Z) {
  return _.build(_.genRegKey(X), loadPadWydeU(_.A(state, Y, Z), state));
};

/**
 * Load wyde unsigned immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.LDWUI = function(state, X, Y, Z) {
  return _.build(_.genRegKey(X), loadPadWydeU(_.AI(state, Y, Z), state));
};

/**
 * Load tetra signed.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.LDT = function(state, X, Y, Z) {
  return _.build(_.genRegKey(X), loadPadTetra(_.A(state, Y, Z), state));
};

/**
 * Load tetra immediate signed.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.LDTI = function(state, X, Y, Z) {
  return _.build(_.genRegKey(X), loadPadTetra(_.AI(state, Y, Z), state));
};

/**
 * Load tetra unsigned.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.LDTU = function(state, X, Y, Z) {
  return _.build(_.genRegKey(X), loadPadTetraU(_.A(state, Y, Z), state));
};

/**
 * Load tetra unsigned immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @param {Diff}
 */
exports.LDTUI = function(state, X, Y, Z) {
  return _.build(_.genRegKey(X), loadPadTetraU(_.AI(state, Y, Z), state));
};

/**
 * Load tetra into the high bits of register X.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 */
exports.LDHT = function(state, X, Y, Z) {
  return _.build(_.genRegKey(X), _.loadTetra(_.A(state, Y, Z), state) + '00000000');
};

/**
 * Load tetra high immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.LDHTI = function(state, X, Y, Z) {
  return _.build(_.genRegKey(X), _.loadTetra(_.AI(state, Y, Z), state) + '00000000');
};

/**
 * Load octa signed.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
var LDO = exports.LDO = function(state, X, Y, Z) {
  return _.build(_.genRegKey(X), _.loadOcta(_.A(state, Y, Z), state));
};

/**
 * Load octa immediate signed.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
var LDOI = exports.LDOI = function(state, X, Y, Z) {
  return _.build(_.genRegKey(X), _.loadOcta(_.AI(state, Y, Z), state));
};

/**
 * Load octa unsigned.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - destination register
 * @param {Hex} Z - destination register
 * @return {Diff}
 */
exports.LDOU = LDO;

/**
 * Load octa unsigned immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.LDOUI = LDOI;
