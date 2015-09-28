var Long = require('long');
var _ = require('../utils');

/**
 * Store the least significant byte of $X into M[$X + $Y]. An integer overflow
 * exception occurs if $X is not between -128 and +127.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
var STB = exports.STB = function(state, X, Y, Z) {
  var x64 = _.regToInt64(X, state);
  var diff = _.build(_.A(state, Y, Z), _.int64ToByte(x64));

  //overflow check
  return _.int64Overflows8(x64) ? _.extend({exceptions: '01000000'}, diff) : diff;
};

/**
 * Store signed byte immediate.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
var STBI = exports.STBI = function(state, X, Y, Z) {
  var x64 = _.regToInt64(X, state);
  var diff = _.build(_.AI(state, Y, Z), _.int64ToByte(x64));

  return _.int64Overflows8(x64) ? _.extend({exceptions: '01000000'}, diff) : diff;
};

/**
 * Store byte unsigned.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.STBU = function(state, X, Y, Z) {
  return _.omit(['exceptions'], STB(state, X, Y, Z));
};

/**
 * Store byte unsigned immediate.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.STBUI = function(state, X, Y, Z) {
  return _.omit(['exceptions'], STBI(state, X, Y, Z));
};

/**
 * Store wyde signed.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.STW = function(state, X, Y, Z) {
  var x64 = _.regToInt64(X, state);
  var w = _.int64ToWyde(x64);
  var addr = _.effectiveAddress(2, _.bigifyOcta(_.A(state, Y, Z)));
  var diff = _.build(
    _.octafyBig(addr), w.substring(0, 2),
    _.octafyBig(addr.plus(1)), w.substring(2)
  );

  //overflow check
  return _.int64Overflows16(x64) ? _.extend({exceptions: '01000000'}, diff) : diff;
};

/**
 * Store wyde signed immediate.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 */
exports.STWI = function(state, X, Y, Z) {
  var x64 = _.regToInt64(X, state);
  var w = _.int64ToWyde(x64);
  var addr = _.effectiveAddress(2, _.bigifyOcta(_.AI(state, Y, Z)));
  var diff = _.build(
    _.octafyBig(addr), w.substring(0, 2),
    _.octafyBig(addr.plus(1)), w.substring(2)
  );

  //overflow check
  return _.int64Overflows16(x64) ? _.extend({exceptions: '01000000'}, diff) : diff;
};

/**
 * Store wyde unsigned.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.STWU = function(state, X, Y, Z) {
  var x64 = _.regToInt64(X, state);
  var w = _.int64ToWyde(x64);
  var addr = _.effectiveAddress(2, _.bigifyOcta(_.A(state, Y, Z)));

  return _.build(
    _.octafyBig(addr), w.substring(0, 2),
    _.octafyBig(addr.plus(1)), w.substring(2)
  );
};

/**
 * Store wyde unsigned immediate.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.STWUI = function(state, X, Y, Z) {
  var x64 = _.regToInt64(X, state);
  var w = _.int64ToWyde(x64);
  var addr = _.effectiveAddress(2, _.bigifyOcta(_.AI(state, Y, Z)));

  return _.build(
    _.octafyBig(addr), w.substring(0, 2),
    _.octafyBig(addr.plus(1)), w.substring(2)
  );
};

/**
 * Store tetra signed.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.STT = function(state, X, Y, Z) {
  var x64 = _.regToInt64(X, state);
  var t = _.int64ToTetra(x64);
  var addr = _.effectiveAddress(4, _.bigifyOcta(_.A(state, Y, Z)));
  var diff = _.build(
    _.octafyBig(addr), t.substring(0, 2),
    _.octafyBig(addr.plus(1)), t.substring(2, 4),
    _.octafyBig(addr.plus(2)), t.substring(4, 6),
    _.octafyBig(addr.plus(3)), t.substring(6)
  );

  return _.int64Overflows32(x64) ? _.extend({exceptions: '01000000'}, diff) : diff;
};

/**
 * Store tetra immediate signed.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.STTI = function(state, X, Y, Z) {
  var x64 = _.regToInt64(X, state);
  var t = _.int64ToTetra(x64);
  var addr = _.effectiveAddress(4, _.bigifyOcta(_.AI(state, Y, Z)));
  var diff = _.build(
    _.octafyBig(addr), t.substring(0, 2),
    _.octafyBig(addr.plus(1)), t.substring(2, 4),
    _.octafyBig(addr.plus(2)), t.substring(4, 6),
    _.octafyBig(addr.plus(3)), t.substring(6)
  );

  return _.int64Overflows32(x64) ? _.extend({exceptions: '01000000'}, diff) : diff;
};

/**
 * Store tetra unsigned.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.STTU = function(state, X, Y, Z) {
  var x64 = _.regToInt64(X, state);
  var t = _.int64ToTetra(x64);
  var addr = _.effectiveAddress(4, _.bigifyOcta(_.A(state, Y, Z)));
  return _.build(
    _.octafyBig(addr), t.substring(0, 2),
    _.octafyBig(addr.plus(1)), t.substring(2, 4),
    _.octafyBig(addr.plus(2)), t.substring(4, 6),
    _.octafyBig(addr.plus(3)), t.substring(6)
  );
};

/**
 * Store tetra unsigned immediate.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.STTUI = function(state, X, Y, Z) {
  var x64 = _.regToInt64(X, state);
  var t = _.int64ToTetra(x64);
  var addr = _.effectiveAddress(4, _.bigifyOcta(_.AI(state, Y, Z)));
  return _.build(
    _.octafyBig(addr), t.substring(0, 2),
    _.octafyBig(addr.plus(1)), t.substring(2, 4),
    _.octafyBig(addr.plus(2)), t.substring(4, 6),
    _.octafyBig(addr.plus(3)), t.substring(6)
  );
};

/**
 * Store octa signed.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
var STO = exports.STO = function(state, X, Y, Z) {
  var x = _.genRegOcta(X, state);
  var addr = _.effectiveAddress(8, _.bigifyOcta(_.A(state, Y, Z)));

  return _.build(
    _.octafyBig(addr), x.substring(0, 2),
    _.octafyBig(addr.plus(1)), x.substring(2, 4),
    _.octafyBig(addr.plus(2)), x.substring(4, 6),
    _.octafyBig(addr.plus(3)), x.substring(6, 8),
    _.octafyBig(addr.plus(4)), x.substring(8, 10),
    _.octafyBig(addr.plus(5)), x.substring(10, 12),
    _.octafyBig(addr.plus(6)), x.substring(12, 14),
    _.octafyBig(addr.plus(7)), x.substring(14)
  );
};

/**
 * Store octa signed immediate.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
var STOI = exports.STOI = function(state, X, Y, Z) {
  var x = _.genRegOcta(X, state);
  var addr = _.effectiveAddress(8, _.bigifyOcta(_.AI(state, Y, Z)));

  return _.build(
    _.octafyBig(addr), x.substring(0, 2),
    _.octafyBig(addr.plus(1)), x.substring(2, 4),
    _.octafyBig(addr.plus(2)), x.substring(4, 6),
    _.octafyBig(addr.plus(3)), x.substring(6, 8),
    _.octafyBig(addr.plus(4)), x.substring(8, 10),
    _.octafyBig(addr.plus(5)), x.substring(10, 12),
    _.octafyBig(addr.plus(6)), x.substring(12, 14),
    _.octafyBig(addr.plus(7)), x.substring(14)
  );
};

/**
 * Store octa unsigned.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.STOU = STO;

/**
 * Store octa unsigned immediate.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.STOUI = STOI;

/**
 * Store high tetra.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.STHT = function(state, X, Y, Z) {
  var x = _.genRegOcta(X, state);
  var addr = _.effectiveAddress(4, _.bigifyOcta(_.A(state, Y, Z)));

  return _.build(
    _.octafyBig(addr), x.substring(0, 2),
    _.octafyBig(addr.plus(1)), x.substring(2, 4),
    _.octafyBig(addr.plus(2)), x.substring(4, 6),
    _.octafyBig(addr.plus(3)), x.substring(6, 8)
  );
};

/**
 * Store high tetra immediate.
 * @param {State} state
 * @param {Hex} X - source register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.STHTI = function(state, X, Y, Z) {
  var x = _.genRegOcta(X, state);
  var addr = _.effectiveAddress(4, _.bigifyOcta(_.AI(state, Y, Z)));

  return _.build(
    _.octafyBig(addr), x.substring(0, 2),
    _.octafyBig(addr.plus(1)), x.substring(2, 4),
    _.octafyBig(addr.plus(2)), x.substring(4, 6),
    _.octafyBig(addr.plus(3)), x.substring(6, 8)
  );
};

/**
 * Store constant octabyte from immediate byte constant.
 * @param {State}
 * @param {Hex} X - immediate byte constant
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.STCO = function(state, X, Y, Z) {
  var addr = _.effectiveAddress(8, _.bigifyOcta(_.A(state, Y, Z)));

  return _.build(
    _.octafyBig(addr), '00',
    _.octafyBig(addr.plus(1)), '00',
    _.octafyBig(addr.plus(2)), '00',
    _.octafyBig(addr.plus(3)), '00',
    _.octafyBig(addr.plus(4)), '00',
    _.octafyBig(addr.plus(5)), '00',
    _.octafyBig(addr.plus(6)), '00',
    _.octafyBig(addr.plus(7)), X
  );

};

/**
 * Store constant octabyte from immediate byte constant. Address calculation
 * uses immediate byte constant Z.
 * @param {State}
 * @param {Hex} X - immediate byte constant
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.STCOI = function(state, X, Y, Z) {
  var addr = _.effectiveAddress(8, _.bigifyOcta(_.AI(state, Y, Z)));

  return _.build(
    _.octafyBig(addr), '00',
    _.octafyBig(addr.plus(1)), '00',
    _.octafyBig(addr.plus(2)), '00',
    _.octafyBig(addr.plus(3)), '00',
    _.octafyBig(addr.plus(4)), '00',
    _.octafyBig(addr.plus(5)), '00',
    _.octafyBig(addr.plus(6)), '00',
    _.octafyBig(addr.plus(7)), X
  );

};
