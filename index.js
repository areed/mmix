var _ = require('highland');
var validator = require('highlandx/validator');
var conditions = require('highlandx/conditions');

var registers = require('./registers');
var utils = require('./utils');
var Memory = require('./Memory');

var int64 = utils.int64;
var uint64 = utils.uint64;
var hexify = utils.hexify;
var decify = utils.decify;

/**
 * @constructor
 * @alias module:mmix
 * @param {Memory} memory
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

/* Adapters */

/**
 * Accepts a function that expects two arguments of type Register and Uint64 and
 * returns a function that expects three arguments of type Register.  The Uint64
 * argument is calculated from the values in the last two register arguments of
 * the returned function.
 * @param {function} fn
 * @return {function}
 */
var sum$Y$Z64U = function(fn) {
  return function($X, $Y, $Z) {
    fn.apply(this, [$X, sum$X64U(this, $Y, $Z)]);
  };
};

/**
 * Accepts a function that expects one argument of type Register and two
 * arguments of type Int64 and returns a function that takes three Register
 * arguments.
 * @param {function} fn
 * @return {function}
 */
var int64$Y$Z = function(fn) {
  return function($X, $Y, $Z) {
    var Y64 = utils.int64(resolve($Y, this));
    var Z64 = utils.int64(resolve($Z, this));

    fn.apply(this, [$X, Y64, Z64]);
  };
};

/**
 * Same as int64$Y$Z but casts the octabytes to Uint64's.
 * @param {function} fn
 * @param {function}
 */
var uint64$Y$Z = function(fn) {
  return function($X, $Y, $Z) {
    var Y64U = uint64(resolve($Y, this));
    var Z64U = uint64(resolve($Z, this));

    fn.apply(this, [$X, Y64U, Z64U]);
  };
};

/**
 * Resolves $Y and $Z to their octabytes before calling the passed function.
 * @param {function} fn
 * @param {function}
 */
var octaYZ = function(fn) {
  return function($X, $Y, $Z) {
    var Y = resolve($Y, this);
    var Z = resolve($Z, this);

    fn.apply(this, [$X, Y, Z]);
  };
};

/* Operations */

/**
 * Core logic for all LD__ functions.
 * @param {ByteWidth} byteWidth
 * @param {boolean} [unsigned] - flag to use sign extension
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
 * Calculate a memory address by casting the octabytes in $Y and $Z as Uint64's
 * and summing them. Load and sign-extend the byte at that address into register $X.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDB = LD(1);

/**
 * Same as LDB but loads the wyde at the calculated address into $X.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDW = LD(2);

/**
 * Same as LDB but loads the tetra at the calculated address into $X.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDT = LD(4);

/**
 * Sames as LDB but loads the octa at the calculated address into $X.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDO = LD(8);

/**
 * Same as LDB but without sign-extension.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDBU = LD(1, true);

/**
 * Same as LDW but without sign-extension.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDWU = LD(2, true);

/**
 * Same as LDT but without sign-extension.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDTU = LD(4, true);

/**
 * Same as LDO but should be preferred in unsigned contexts.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDOU = MMIX.prototype.LDO;

/**
 * Load the tetra at the memory address calculated from $Y and $Z into the high
 * bits of register X.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDTH = function($X, $Y, $Z) {
  this.LDTU($X, $Y, $Z);
  this.registers[$X] = this.registers[$X].substring(8,16) + '00000000';
};

/**
 * Load the sum of the unsigned octabytes in $Y and $Z into $X.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDA = isRgstrRgstrRgstr(sum$Y$Z64U(function($X, A) {
  this.registers[$X] = utils.padOcta(A.toString(16).toUpperCase());
}));

/**
 * Core logic for all ST_ methods.
 * @param {ByteWidth} byteWidth
 * @param {string} memMethodName - getByte, getWyde, getTetra, getOcta
 * @return {function}
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
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.STB = ST(1, 'setByte');

/**
 * Same as STB but stores the low wyde from register $X.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.STW = ST(2, 'setWyde');

/**
 * Same as STB but stores the low tetra from register $X.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.STT = ST(4, 'setTetra');

/**
 * Same as STB but stores the entire octabyte from register $X.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.STO = ST(8, 'setOcta');

/**
 * Has the same effect on memory as STB, but overflow never occurs.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.STBU = MMIX.prototype.STB;

/**
 * Has the same effect on memory as STW, but overflow never occurs.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.STWU = MMIX.prototype.STW;

/**
 * Has the same effect on memory as STT, but overflow never occurs.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.STTU = MMIX.prototype.STT;

/**
 * Has the same effect on memory as STOU, but overflow never occurs.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.STOU = MMIX.prototype.STO;

/**
 * Same as STT but stores the high tetra from register $X.
 * @function
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
 * @function
 * @param {Hex} X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.STCO = isByteRgstrRgstr(sum$Y$Z64U(function(X, A) {
  var data = utils.padOcta(X);
  this.memory.setOcta(data, A);
}));

/**
 * Casts the octabytes in $Y and $Z to int64's and puts their sum in $X.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.ADD = isRgstrRgstrRgstr(int64$Y$Z(function($X, Y64, Z64) {
  this.registers[$X] = utils.hexify(Y64.add(Z64));
}));

/**
 * Casts the octabytes in $Y and $Z to int64's and puts the difference of Y - Z
 * in $X.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.SUB = isRgstrRgstrRgstr(int64$Y$Z(function($X, Y64, Z64) {
  this.registers[$X] = utils.hexify(Y64.subtract(Z64));
}));

/**
 * Casts the octabytes in $Y and $Z to int64's and puts their product in $X.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.MUL = isRgstrRgstrRgstr(int64$Y$Z(function($X, Y64, Z64) {
  this.registers[$X] = utils.hexify(Y64.multiply(Z64));
}));

/**
 * Casts the octabytes in $Y and $Z to int64's and divides Y by Z. Puts the
 * quotient in $X and the remainder in remainder register rR. If the divisor $Z
 * is 0, set $X to 0 and put $Y in rR.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.DIV = isRgstrRgstrRgstr(int64$Y$Z(function($X, Y64, Z64) {
  if (Z64.toNumber() === 0) {
    this.registers[$X] = hexify(Z64);
    this.registers.rR = hexify(Y64);
    //an "integer divide check" also occurs at this point according to the spec
    return;
  }
  this.registers[$X] = hexify(Y64.div(Z64));
  this.registers.rR = hexify(Y64.modulo(Z64));
}));

/**
 * Casts the octabytes in $Y and $Z to uint64's and puts their sum in $X.
 * Same as LDA.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.ADDU = isRgstrRgstrRgstr(uint64$Y$Z(function($X, Y64U, Z64U) {
  this.registers[$X] = hexify(Y64U.add(Z64U));
}));

/**
 * Casts the octabytes in $Y and $Z to uint64's and puts the difference of Y - Z
 * in $X.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.SUBU = isRgstrRgstrRgstr(uint64$Y$Z(function($X, Y64U, Z64U) {
  this.registers[$X] = hexify(Y64U.subtract(Z64U));
}));

/**
 * Casts the octabytes in $Y and $Z to uint64's and puts the low 8 bytes of
 * their product in $X and the high 8 bytes into the himult register rH.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.MULU = isRgstrRgstrRgstr(octaYZ(function($X, Y, Z) {
  var Yd = decify(Y);
  var Zd = decify(Z);
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
 * @param {...Register} registers
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
