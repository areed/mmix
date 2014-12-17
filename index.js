/** @module mmix */
var registers = require('./registers');
var utils = require('./utils');
var Memory = require('./Memory');

/**
 * @constructor
 * @alias module:mmix
 */
function MMIX(memory) {
  this.memory = memory;
  this.registers = {};
}

/**
 * Core logic for all LD__ functions.
 * @param {number} byteWidth - 1, 2, 4, or 8
 * @param {boolean} [unsigned]
 * @return {function}
 */
var LD = function(byteWidth, unsigned) {
  return function($X, $Y, $Z) {
    if (typeof registers[$X] === 'undefined') {
      throw new Error('The machine does not have a register named ' + $X);
    }
    if (typeof registers[$Y] === 'undefined') {
      throw new Error('MMIX does not have a register ' + $Y);
    }
    if (typeof registers[$Z] === 'undefined') {
      throw new Error('MMIX does not have a register ' + $Z);
    }

    var Y = utils.uint64(this.registers[$Y]);
    var Z = utils.uint64(this.registers[$Z]);
    var A = Y.add(Z);
    var start = utils.effectiveAddress(byteWidth, A);
    var bytes = [];
    for (var i = 0; i < byteWidth; i++) {
      bytes.push(this.memory.getByte(start.add(i)));
    }
    var data = bytes.join('');
    this.registers[$X] = unsigned ? utils.padOcta(data) : utils.signExtend(byteWidth, data);
  };
};

/**
 * Load the byte at memory address Y + Z, sign-extend to octa, and put in
 * register X.
 * @param {Register} X
 * @param {Octabyte} Y
 * @param {Octabyte} Z
 */
MMIX.prototype.LDB = LD(1);

/**
 * Load the wyde at memory address Y + Z, sign-extend to octa, and put in
 * register X.
 * @param {Register} X
 * @param {Octabyte} Y
 * @param {Octabyte} Z
 */
MMIX.prototype.LDW = LD(2);

/**
 * Load the tetra at memory address Y + Z, sign-extend to octa, and put in
 * register X.
 * @param {Register} X
 * @param {Octabyte} Y
 * @param {Octabyte} Z
 */
MMIX.prototype.LDT = LD(4);

/**
 * Load the octabyte at memory address Y + Z into register X.
 * @param {Register} X
 * @param {Octabyte} Y
 * @param {Octabyte} Z
 */
MMIX.prototype.LDO = LD(8);

/**
 * Load the byte at memory address Y + Z into register X.
 * @param {Register} X
 * @param {Octabyte} Y
 * @param {Octabyte} Z
 */
MMIX.prototype.LDBU = LD(1, true);

/**
 * Load the wyde at memory address Y + Z into register X.
 * @param {Register} X
 * @param {Octabyte} Y
 * @param {Octabyte} Z
 */
MMIX.prototype.LDWU = LD(2, true);

/**
 * Load the tetra at memory address Y + Z into register X.
 * @param {Register} X
 * @param {Octabyte} Y
 * @param {Octabyte} Z
 */
MMIX.prototype.LDTU = LD(4, true);

/**
 * Load the octabyte at memory address Y + Z into register X.
 * @param {Register} X
 * @param {Octabyte} Y
 * @param {Octabyte} Z
 */
MMIX.prototype.LDOU = MMIX.prototype.LDO;

/**
 * Load the tetra at memory address Y + Z into the high bits of register X.
 * @param {Register} X
 * @param {Octabyte} Y
 * @param {Octabyte} Z
 */
MMIX.prototype.LDTH = function(X, Y, Z) {
  this.LDTU(X, Y, Z);
  this.registers[X] = this.registers[X].substring(8,16) + '00000000';
};

/**
 * Load the memory address Y + Z into register X.
 * @param {Register} X
 * @param {Octabyte} Y
 * @param {Octabyte} Z
 */
MMIX.prototype.LDA = function(X, Y, Z) {
  if (typeof registers[X] === 'undefined') {
    throw new Error('The machine does not have a register named ' + X);
  }
  if (typeof Y !== 'string' || Y.length !== 2) {
    throw new Error(Y + ' should be a single byte hex string.');
  }
  if (typeof Z !== 'string' || Z.length !== 2) {
    throw new Error(Z + ' should be a single byte hex string.');
  }

  this.registers[X] = utils.padOcta(utils.uint64(Y).add(utils.uint64(Z)).toString(16).toUpperCase());
};

/**
 * Stores the low byte from the value in register $X at the memory address
 * obtained by adding the values in registers $Y and $Z interpreted as unsigned
 * integers.
 */
MMIX.prototype.STB = function($X, $Y, $Z) {
  if (typeof registers[$X] === 'undefined') {
    throw new Error('MMIX does not have a register ' + $X);
  }
  if (typeof registers[$Y] === 'undefined') {
    throw new Error('MMIX does not have a register ' + $Y);
  }
  if (typeof registers[$Z] === 'undefined') {
    throw new Error('MMIX does not have a register ' + $Z);
  }

  var X = this.registers[$X];
  var Y = this.registers[$Y];
  var Z = this.registers[$Z];
  var data = X.substring(14, 16);
  var A = utils.uint64(Y).add(utils.uint64(Z));
  this.memory.setByte(data, A);
};

/**
 * Stores the low wyde from the data in register $X at the memory address
 * obtained by casting the data in $Y and $Z as uint64's and summing them.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.STW = function($X, $Y, $Z) {
  var X = resolve($X, this);
  var Y = resolve($Y, this);
  var Z = resolve($Z, this);

  var data = X.substring(12);
  var A = utils.uint64(Y).add(utils.uint64(Z));
  this.memory.setWyde(data, A);
};

/**
 * Stores the low tetra from the data in the register $X at the memory address
 * obtained by casting the data in $Y and $Z as uint64's and summing them.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.STT = function($X, $Y, $Z) {
  var X = resolve($X, this);
  var Y = resolve($Y, this);
  var Z = resolve($Z, this);

  var data = X.substring(8);
  var A = utils.uint64(Y).add(utils.uint64(Z));
  this.memory.setTetra(data, A);
};

/**
 * Stores the octabyte in register $X at the memory address obtained by
 * casting the octabytes in $Y and $Z as uint64's and summing them.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.STO = function($X, $Y, $Z) {
  var X = resolve($X, this);
  var Y = resolve($Y, this);
  var Z = resolve($Z, this);

  var A = utils.uint64(Y).add(utils.uint64(Z));
  this.memory.setOcta(X, A);
};

/**
 * Has the same effect on memory as STB, but overflow never occurs.
 */
MMIX.prototype.STBU = MMIX.prototype.STB;

/**
 * Has the same effect on memory as STW, but overflow never occurs.
 */
MMIX.prototype.STWU = MMIX.prototype.STW;

/**
 * Has the same effect on memory as STT, but overflow never occurs.
 */
MMIX.prototype.STTU = MMIX.prototype.STT;

/**
 * Has the same effect on memory as STOU, but overflow never occurs.
 */
MMIX.prototype.STOU = MMIX.prototype.STO;

/**
 * Stores the high tetra from the data in the register $X at the memory address
 * obtained by casting the data in $Y and $Z as uint64's and summing them.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.STHT = function($X, $Y, $Z) {
  var X = resolve($X, this);
  var Y = resolve($Y, this);
  var Z = resolve($Z, this);

  var data = X.substring(0,8);
  var A = utils.uint64(Y).add(utils.uint64(Z));
  this.memory.setTetra(data, A);
};

/**
 * Stores the constant byte X in the memory address obtained by casting the data
 * in $Y and $Z as uint64's and summing them.
 * @param {Hex} X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.STCO = function(X, $Y, $Z) {
  var data = utils.padOcta(X);
  var Y = resolve($Y, this);
  var Z = resolve($Z, this);
  var A = utils.uint64(Y).add(utils.uint64(Z));
  this.memory.setOcta(data, A);
};

/**
 * Checks that the register is valid then returns the data held in the register.
 * @param {Register} $X
 * @param {Object} mmix - the machine to check
 * @return {Hex}
 */
function resolve($X, mmix) {
  if (typeof registers[$X] === 'undefined') {
    throw new Error('MMIX does not have a register ' + $X);
  }
  return mmix.registers[$X];
}

module.exports = MMIX;
