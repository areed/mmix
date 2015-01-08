var _ = require('./utils');
var Big = require('Big.js');

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

/**
 * Multiply signed.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.MUL = function(state, X, Y, Z) {
  var bigX = _.regToInt(Y, state).times(_.regToInt(Z, state));
  var diff = _.build(_.genRegKey(X), modTwo64th(bigX));

  return _.bigOverflows64(bigX) ? _.extend({exceptions: '01000000'}, diff) : diff;
};

/**
 * Multiply signed immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.MULI = function(state, X, Y, Z) {
  var bigX = _.regToInt(Y, state).times(_.byteToUint(Z, state));
  var diff = _.build(_.genRegKey(X), modTwo64th(bigX));

  return _.bigOverflows64(bigX) ? _.extend({exceptions: '01000000'}, diff) : diff;
};

/**
 * Multiply unsigned
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.MULU = function(state, X, Y, Z) {
  var yBig = _.regToUint(Y, state);
  var zBig = _.regToUint(Z, state);
  var prod = yBig.times(zBig);
  var doubleOcta = _.hexify128U(prod);

  return _.build(
    _.genRegKey(X),
    prod.substring(16, 32),
    'rH',
    prod.substring(0, 16)
  );
};

/**
 * Multiply unsigned immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.MULUI = function(state, X, Y, Z) {
  var yBig = _.regToUint(Y, state);
  var zBig = _.byteToUint(Z, state);
  var prod = yBig.times(zBig);
  var doubleOcta = _.hexify128U(prod);

  return _.build(
    _.genRegKey(X),
    prod.substring(16, 32),
    'rH',
    prod.substring(0, 16)
  );
};

/**
 * Divide signed.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.DIV = function(state, X, Y, Z) {
  var bigZ = _.regToInt(Z, state);
  var bigY = _.regToInt(Y, state);
  var overflows = false;

  if (bigZ.cmp(0) === 0) {
    return _.build(
      _.genRegKey(X),
      _.ZEROS,
      'rR',
      _.genRegOcta(Y, state),
      'exceptions',
      '10000000'  //integer divide check
    );
  }
  //an integer overflow exception can only occur in one case: when -2^63 is
  //divided by -1
  if (_.genRegOcta(Y, state) === '8000000000000000' &&
      _.genRegOcta(Z, state) === 'FFFFFFFFFFFFFFFF') {
    overflows = true;
  }
  var diff = _.build(
    _.genRegKey(X),
    _.hexify64(_.quotient(bigZ, bigY)),
    'rR',
    _.hexify64(_.remainder(bigZ, bigY))
  );
  return overflows ? _.extend({exceptions: '01000000'}, diff) : diff;
};

/**
 * Divide signed immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.DIVI = function(state, X, Y, Z) {
  //since the divisor is always nonnegative, no integer overflow can occur
  var bigY = _.regToInt(Y, state);
  var bigZ = _.byteToUint(Z);

  if (bigZ.cmp(0) === 0) {
    return _.build(
      _.genRegKey(X),
      _.ZEROS,
      'rR',
      _.genRegOcta(Y, state),
      'exceptions',
      '10000000'  //integer divide check
    );
  }
  return _.build(
    _.genRegKey(X),
    _.hexify64(_.quotient(bigZ, bigY)),
    'rR',
    _.hexify64(_.remainder(bigZ, bigY))
  );
};

/**
 * Divide unsigned.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.DIVU = function(state, X, Y, Z) {
  var yBig = _.regToUint(Y, state);
  var zBig = _.regToUint(Z, state);
  var rDBig = _.specialRegToUint('rD', state);
  var rDYBig = rDBig.times(Big(2).pow(64)).plus(yBig);

  /* 
   * If rD is greater than or equal to the divisor (and in particular if the
   * divisor is zero), then $X is set to rD and rR is set to $Y.  
   */
  if (zBig.cmp(rDBig) !== 1) {
    return _.build(
      _.genRegKey(X),
      _.specialRegOcta('rD', state),
      'rR',
      _.genRegOcta(Y, state)
    );
  }

  return _.build(
    _.genRegKey(X),
    _.hexify64(_.quotient(zBig, rDYBig)),
    'rR',
    _.hexify64(_.remainder(zBig, rDYBig))
  );
};

/**
 * Divide unsigned immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.DIVUI = function(state, X, Y, Z) {
  var yBig = _.regToUint(Y, state);
  var zBig = _.byteToUint(Z, state);
  var rDBig = _.specialRegToUint('rD', state);
  var rDYBig = rDBig.times(Big(2).pow(64)).plus(yBig);

  /* 
   * If rD is greater than or equal to the divisor (and in particular if the
   * divisor is zero), then $X is set to rD and rR is set to $Y.  
   */
  if (zBig.cmp(rDBig) !== 1) {
    return _.build(
      _.genRegKey(X),
      _.specialRegOcta('rD', state),
      'rR',
      _.genRegOcta(Y, state)
    );
  }

  return _.build(
    _.genRegKey(X),
    _.hexify64(_.quotient(zBig, rDYBig)),
    'rR',
    _.hexify64(_.remainder(zBig, rDYBig))
  );
};
