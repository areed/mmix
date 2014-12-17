/** @module mmix */
var _ = require('highland');
var validator = require('highlandx/validator');
var conditions = require('highlandx/conditions');

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

/* Precondtion Validators */
var isRegister = function($X) {
  return typeof registers[$X] !== 'undefined';
};
var arg0IsRegister = validator('The first argument is not a register in MMIX.', isRegister);
var arg1IsRegister = validator('The second argument is not a register in MMIX.', function(x, $Y) {
  return isRegister($Y);
});
var arg2IsRegister = validator('The third argument is not a register in MMIX.', function(x, y, $Z) {
  return isRegister($Z);
});

var validWidth = validator('Byte width must be 1, 2, 4, or 8.', function(w) {
  return w === 1 || w === 2 || w === 4 || w === 8;
});

var isByte = function(h) {
  return typeof h === 'string' && h.length === 2;
};
var arg0IsByte = validator('The first argument is not a single-byte hex string.', isByte);

var isRgstrRgstrRgstr = _.ncurry(4, conditions(arg0IsRegister, arg1IsRegister, arg2IsRegister));
var isByteRgstrRgstr = _.ncurry(4, conditions(arg0IsByte, arg1IsRegister, arg2IsRegister));

/* Operations */

/**
 * Transforms $Y and $Z args into their Uint64 sum.
 */
var sum$Y$Z64U = function(fn) {
  return function($X, $Y, $Z) {
    fn.apply(this, [$X, sum$X64U(this, $Y, $Z)]);
  };
};

/**
 * Core logic for all LD__ functions.
 * @param {number} byteWidth - 1, 2, 4, or 8
 * @param {boolean} [unsigned]
 * @return {function}
 */
var LD = function(byteWidth, unsigned) {
  return isRgstrRgstrRgstr(sum$Y$Z64U(function($X, A) {
    var start = utils.effectiveAddress(byteWidth, A);
    var bytes = [];
    for (var i = 0; i < byteWidth; i++) {
      bytes.push(this.memory.getByte(start.add(i)));
    }
    var data = bytes.join('');
    this.registers[$X] = unsigned ? utils.padOcta(data) : utils.signExtend(byteWidth, data);
  }));
};

/**
 * Load the byte at memory address Y + Z, sign-extend to octa, and put in
 * register X.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDB = LD(1);

/**
 * Load the wyde at memory address Y + Z, sign-extend to octa, and put in
 * register X.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDW = LD(2);

/**
 * Load the tetra at memory address Y + Z, sign-extend to octa, and put in
 * register X.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDT = LD(4);

/**
 * Load the octabyte at memory address Y + Z into register X.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDO = LD(8);

/**
 * Load the byte at memory address Y + Z into register X.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDBU = LD(1, true);

/**
 * Load the wyde at memory address Y + Z into register X.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDWU = LD(2, true);

/**
 * Load the tetra at memory address Y + Z into register X.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDTU = LD(4, true);

/**
 * Load the octabyte at memory address Y + Z into register X.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDOU = MMIX.prototype.LDO;

/**
 * Load the tetra at memory address Y + Z into the high bits of register X.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDTH = function($X, $Y, $Z) {
  this.LDTU($X, $Y, $Z);
  this.registers[$X] = this.registers[$X].substring(8,16) + '00000000';
};

/**
 * Load the memory address Y + Z into register X.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDA = isRgstrRgstrRgstr(sum$Y$Z64U(function($X, A) {
  this.registers[$X] = utils.padOcta(A.toString(16).toUpperCase());
}));

/**
 * Core logic for all ST_ methods.
 */
var ST = function(byteWidth, memMethodName) {
  return isRgstrRgstrRgstr(sum$Y$Z64U(function($X, A) {
    var data = this.registers[$X].substring(16 - (2 * byteWidth));
    this.memory[memMethodName](data, A);
  }));
};

/**
 * Stores the low byte from the value in register $X at the memory address
 * obtained by adding the values in registers $Y and $Z interpreted as unsigned
 * integers.
 */
MMIX.prototype.STB = ST(1, 'setByte');

/**
 * Stores the low wyde from the data in register $X at the memory address
 * obtained by casting the data in $Y and $Z as uint64's and summing them.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.STW = ST(2, 'setWyde');

/**
 * Stores the low tetra from the data in the register $X at the memory address
 * obtained by casting the data in $Y and $Z as uint64's and summing them.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.STT = ST(4, 'setTetra');

/**
 * Stores the octabyte in register $X at the memory address obtained by
 * casting the octabytes in $Y and $Z as uint64's and summing them.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.STO = ST(8, 'setOcta');

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
MMIX.prototype.STHT = isRgstrRgstrRgstr(sum$Y$Z64U(function($X, A) {
  var data = resolve($X, this).substring(0,8);

  this.memory.setTetra(data, A);
}));

/**
 * Stores the constant byte X in the memory address obtained by casting the data
 * in $Y and $Z as uint64's and summing them.
 * @param {Hex} X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.STCO = isByteRgstrRgstr(sum$Y$Z64U(function(X, A) {
  var data = utils.padOcta(X);
  this.memory.setOcta(data, A);
}));

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

/**
 * Return the sum of all register arguments when their data is cast as uint64's.
 * @param {Object} mmix - a machine
 * @param {Register...} registers
 * @return {Uint64}
 */
function sum$X64U(mmix) {
  var registers = [].slice.call(arguments, 1);

  return registers
    .map(function($X) {
      return resolve($X, mmix);
    })
    .map(function(X) {
      return utils.uint64(X);
    })
    .reduce(function(sum, X64U) {
      return X64U.add(sum);
    }, 0);
}

module.exports = MMIX;
