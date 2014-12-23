var Big = require('big.js');
var Long = require('long');
var hexa = require('hexa');

var utils = require('./utils');
var _ = utils;
var Memory = require('./Memory');

var decify = hexa.decify;
var u = function($R) {
  return $R.unsigned();
};
var s = function($R) {
  return $R.signed();
};
var hexify64 = function(deci) {
  if (deci instanceof Big) {
    return hexa.hexify(deci.toFixed(), 64);
  }
  return hexa.hexify(deci, 64);
};
var hexify64U = utils.hexify64U;
var hexify128 = function(deci) {
  if (deci instanceof Big) {
    return hexa.hexify(deci.toFixed(), 64);
  }
  return hexa.hexify(deci, 128);
};
var extendUnsignedTo64 = function(hex) {
  if (hex instanceof Big) {
    return hexa.pad0Octa(hexify64(hex.toFixed()));
  }
  return hexa.pad0Octa(hex);
};
var signExtend8To64 = function(hex) {
  return hexa.signExtend64(8, hex);
};
var signExtend16To64 = function(hex) {
  return hexa.signExtend64(16, hex);
};
var signExtend32To64 = function(hex) {
  return hexa.signExtend64(32, hex);
};

var two = new Big('2');
var twoToThe64th = two.pow(64);
var zeros = '0000000000000000';

/**
 * @constructor
 * @alias module:mmix
 * @param {Memory} memory
 */
function MMIX(memory) {
  this.memory = memory;
  var registers = this.registers = {};

  for (var i = 0; i < 256; i++) {
    addRegister(registers, '$' + i);
  }
  ('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    .split('')
    .concat(['BB', 'TT', 'WW', 'XX', 'YY', 'ZZ'])
    .forEach(function(x) {
      addRegister(registers, 'r' + x);
    });
}

function addRegister(registers, name) {
  var bits = '0000000000000000';

  Object.defineProperty(registers, name, {
    enumerable: true,
    get: function() {
      return bits;
    },
    set: function(hex) {
      if (typeof hex !== 'string' || hex.length !== 16) {
        throw new Error(['Register', name, 'requires 16 hex charcaters, got', hex].join(' '));
      }
      bits = hex;
    },
  });
}

function rgstrsYZ(op) {
  return function($X, $Y, $Z) {
    op.apply(this, [
      $X,
      new Register(this.registers, $Y),
      new Register(this.registers, $Z),
    ]);
  };
}

function rgstrsY(op) {
  return function($X, $Y, $Z) {
    op.apply(this, [
      $X,
      new Register(this.registers, $Y),
      $Z,
    ]);
  };
}

function rgstrsZ(op) {
  return function($X, Y, $Z) {
    op.apply(this, [
      $X,
      Y,
      new Register(this.registers, $Z),
    ]);
  };
}

function Register(registers, name) {
  this.registers = registers;
  this.name = name;
}

Register.prototype.hex = function() {
  return this.registers[this.name];
};

Register.prototype.unsigned = function() {
  return Big(decify(this.registers[this.name], 64));
};

Register.prototype.signed = function() {
  return Big(decify(this.registers[this.name], 64, true));
};

/**
 * Used by the LD* operations to calculate a memory address.
 * @param {Register} $Y
 * @param {Register} $Z
 * @return {Int}
 */
function A($Y, $Z) {
  return u($Y).plus(u($Z)).mod(twoToThe64th);
}

/**
 * Calculate a memory address by casting the octabytes in $Y and $Z to Uint64's
 * and summing them. Load and sign-extend the byte at that address into register $X.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDB = rgstrsYZ(function($X, $Y, $Z) {
  this.registers[$X] = signExtend8To64(this.memory.getByte(A($Y, $Z)));
});

/**
 * Same as LDB but loads the wyde at the calculated address into $X.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDW = rgstrsYZ(function($X, $Y, $Z) {
  this.registers[$X] = signExtend16To64(this.memory.getWyde(A($Y, $Z)));
});

/**
 * Same as LDB but loads the tetra at the calculated address into $X.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDT = rgstrsYZ(function($X, $Y, $Z) {
  this.registers[$X] = signExtend32To64(this.memory.getTetra(A($Y, $Z)));
});

/**
 * Sames as LDB but loads the octa at the calculated address into $X.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDO = rgstrsYZ(function($X, $Y, $Z) {
  this.registers[$X] = this.memory.getOcta(A($Y, $Z));
});

/**
 * Same as LDB but without sign-extension.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDBU = rgstrsYZ(function($X, $Y, $Z) {
  this.registers[$X] = extendUnsignedTo64(this.memory.getByte(A($Y, $Z)));
});

/**
 * Same as LDW but without sign-extension.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDWU = rgstrsYZ(function($X, $Y, $Z) {
  this.registers[$X] = extendUnsignedTo64(this.memory.getWyde(A($Y, $Z)));
});

/**
 * Same as LDT but without sign-extension.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.LDTU = rgstrsYZ(function($X, $Y, $Z) {
  this.registers[$X] = extendUnsignedTo64(this.memory.getTetra(A($Y, $Z)));
});

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
MMIX.prototype.LDA = rgstrsYZ(function($X, $Y, $Z) {
  this.registers[$X] = extendUnsignedTo64(A($Y, $Z));
});

/**
 * Stores the low byte from the value in register $X at the memory address
 * obtained by adding the values in registers $Y and $Z interpreted as unsigned
 * integers.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.STB = rgstrsYZ(function($X, $Y, $Z) {
  this.memory.setByte(this.registers[$X].substring(14), A($Y, $Z));
});

/**
 * Same as STB but stores the low wyde from register $X.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.STW = rgstrsYZ(function($X, $Y, $Z) {
  this.memory.setWyde(this.registers[$X].substring(12), A($Y, $Z));
});

/**
 * Same as STB but stores the low tetra from register $X.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.STT = rgstrsYZ(function($X, $Y, $Z) {
  this.memory.setTetra(this.registers[$X].substring(8), A($Y, $Z));
});

/**
 * Same as STB but stores the entire octabyte from register $X.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.STO = rgstrsYZ(function($X, $Y, $Z) {
  this.memory.setOcta(this.registers[$X], A($Y, $Z));
});

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
MMIX.prototype.STHT = rgstrsYZ(function($X, $Y, $Z) {
  this.memory.setTetra(this.registers[$X].substring(0, 8), A($Y, $Z));
});

/**
 * Stores the constant byte X in the memory address obtained by casting the data
 * in $Y and $Z as uint64's and summing them.
 * @function
 * @param {Hex} X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.STCO = rgstrsYZ(function(X, $Y, $Z) {
  this.memory.setOcta(extendUnsignedTo64(X), A($Y, $Z));
});

/**
 * Casts the octabytes in $Y and $Z to int64's and puts their sum in $X.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.ADD = rgstrsYZ(function($X, $Y, $Z) {
  this.registers[$X] = hexify64(s($Y).plus(s($Z)).toFixed());
});

/**
 * Casts the octabytes in $Y and $Z to int64's and puts the difference of Y - Z
 * in $X.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.SUB = rgstrsYZ(function($X, $Y, $Z) {
  this.registers[$X] = hexify64(s($Y).minus(s($Z)).toFixed());
});

/**
 * Casts the octabytes in $Y and $Z to int64's and puts their product in $X.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.MUL = rgstrsYZ(function($X, $Y, $Z) {
  this.registers[$X] = hexify64(s($Y).times(s($Z)).toFixed());
});

/**
 * Cast the octabytes in $Y and $Z to signed integers and divide Y by Z.
 * Put the quotient in $X and the remainder in rR. If the divisor Z is 0, set $X
 * to 0 and copy the octabyte in $Y to rR.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.DIV = rgstrsYZ(function($X, $Y, $Z) {
  if (s($Z).cmp(0) === 0) {
    this.registers[$X] = '0000000000000000';
    this.registers.rR = $Y.hex();
    //an "integer divide check" also occurs at this point according to the spec
    return;
  }
  this.registers[$X] = hexify64(utils.quotient(s($Z), s($Y)));
  this.registers.rR = hexify64(utils.remainder(s($Z), s($Y)));
});

/**
 * Casts the octabytes in $Y and $Z to uint64's and puts their sum in $X.
 * Same as LDA.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.ADDU = rgstrsYZ(function($X, $Y, $Z) {
  this.registers[$X] = _.hexify64U(u($Y).plus(u($Z)));
});

/**
 * Casts the octabytes in $Y and $Z to uint64's and puts the difference of Y - Z
 * in $X.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.SUBU = rgstrsYZ(function($X, $Y, $Z) {
  this.registers[$X] = hexify64U(u($Y).minus(u($Z)));
});

/**
 * Casts the octabytes in $Y and $Z to uint64's and puts the low 8 bytes of
 * their product in $X and the high 8 bytes into the himult register rH.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.MULU = rgstrsYZ(function($X, $Y, $Z) {
  var prod = _.hexify128U(u($Y).times(u($Z)));

  this.registers[$X] = prod.substring(16);
  this.registers.rH = prod.substring(0, 16);
});

/* Casts the octabytes in $Z and rD to Uint64's. If Z64U > rD64U, concatenate
 * the octabytes in rD and $Y, cast it to a Uint128, divide it by Z64U,
 * and put the quotient in $X and the remainder in rR. Otherwise copy the
 * octabyte from rD into $X and the octabyte from $Y into rR.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.DIVU = rgstrsYZ(function($X, $Y, $Z) {
  var Y = u($Y);
  var Z = u($Z);
  var rD = u(new Register(this.registers, 'rD'));
  var rDY = rD.times(twoToThe64th).plus(Y);

  if (Z.cmp(rD) === 1) {
    this.registers[$X] = hexify64(utils.quotient(Z, rDY).toFixed());
    this.registers.rR = hexify64(utils.remainder(Z, rDY).toFixed());
    return;
  }
  this.registers[$X] = this.registers.rD;
  this.registers.rR = $Y.hex();
});

/** Casts the octabytes in $Y and $Z to UIntBig's and set $X to (2Y + Z) mod 2^64.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype['2ADDU'] = rgstrsYZ(function($X, $Y, $Z) {
  this.registers[$X] = hexify64(u($Y).times(2).plus(u($Z)));
});

/**
 * Same as 2ADDU but scales Y by 4.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype['4ADDU'] = rgstrsYZ(function($X, $Y, $Z) {
  this.registers[$X] = hexify64(u($Y).times(4).plus(u($Z)));
});

/**
 * Same as 2ADDU but scales Y by 8.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype['8ADDU'] = rgstrsYZ(function($X, $Y, $Z) {
  this.registers[$X] = hexify64(u($Y).times(8).plus(u($Z)));
});

/**
 * Same as 2ADDU but scales Y by 16.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype['16ADDU'] = rgstrsYZ(function($X, $Y, $Z) {
  this.registers[$X] = hexify64(u($Y).times(16).plus(u($Z)));
});

/**
 * Negate signed.
 * @function
 * @param {Register} $X
 * @param {Hex} Y - an unsigned constant 0 - 255, usually 0
 * @param {Register} $Z
 */
MMIX.prototype.NEG = rgstrsZ(function($X, Y, $Z) {
  this.registers[$X] = _.hexify64(Big(_.decify(Y, 8, false)).minus(s($Z)));
});

/**
 * Same as NEG but unsigned.
 * @function
 * @param {Register}
 * @param {Hex} Y
 * @param {Register} $Z
 */
MMIX.prototype.NEGU = rgstrsZ(function($X, Y, $Z) {
  this.registers[$X] = _.hexify64U(Big(_.decify(Y, 8, false)).minus(u($Z)));
});

/**
 * Shift left.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.SL = rgstrsYZ(function($X, $Y, $Z) {
  var Z = parseInt(u($Z).toString(), 10);
  if (Z >= 64) {
    this.registers[$X] = '0000000000000000';
    return;
  }
  this.registers[$X] = _.hexify64(s($Y).times(two.pow(Z)));
});

/**
 * Shift left unsigned. Produces the same result as SL without overflow.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.SLU = MMIX.prototype.SL;

/**
 * Shift right signed.
 * @param function
 * @param {Register} $X;
 * @param {Register} $Y;
 * @param {Register} $Z;
 */
MMIX.prototype.SR = rgstrsYZ(function($X, $Y, $Z) {
  var Z = parseInt(u($Z).toString(), 10);
  this.registers[$X] = _.hexify64(_.quotient(two.pow(Z), s($Y)));
});

/**
 * Shift right unsigned.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.SRU = rgstrsYZ(function($X, $Y, $Z) {
  var Z = parseInt(u($Z).toString(), 10);
  this.registers[$X] = _.hexify64U(_.quotient(two.pow(Z), u($Y)));
});

/**
 * Compare signed.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.CMP = rgstrsYZ(function($X, $Y, $Z) {
  var cmp = s($Y).cmp(s($Z));
  if (cmp === -1) {
    this.registers[$X] = 'FFFFFFFFFFFFFFFF';
    return;
  }
  if (cmp === 0) {
    this.registers[$X] = '0000000000000000';
    return;
  }
  this.registers[$X] = '0000000000000001';
});

/**
 * Compare unsigned.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.CMPU = rgstrsYZ(function($X, $Y, $Z) {
  var cmp = u($Y).cmp(u($Z));
  if (cmp === -1) {
    this.registers[$X] = 'FFFFFFFFFFFFFFFF';
    return;
  }
  if (cmp === 0) {
    this.registers[$X] = '0000000000000000';
    return;
  }
  this.registers[$X] = '0000000000000001';
});

/**
 * Conditional set if negative.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.CSN = rgstrsY(function($X, $Y, $Z) {
  if (s($Y).cmp(0) === -1) {
    this.registers[$X] = this.registers[$Z];
  }
});

/**
 * Conditional set if zero.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.CSZ = rgstrsY(function($X, $Y, $Z) {
  if (s($Y).cmp(0) === 0) {
    this.registers[$X] = this.registers[$Z];
  }
});

/**
 * Conditional set if positive.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.CSP = rgstrsY(function($X, $Y, $Z) {
  if (s($Y).cmp(0) === 1) {
    this.registers[$X] = this.registers[$Z];
  }
});

/**
 * Conditional set if odd.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.CSOD = rgstrsY(function($X, $Y, $Z) {
  if (_.remainder(two, s($Y)).cmp(1) === 0) {
    this.registers[$X] = this.registers[$Z];
  }
});

/**
 * Conditional set if nonnegative.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.CSNN = rgstrsY(function($X, $Y, $Z) {
  if (s($Y).cmp(0) > -1) {
    this.registers[$X] = this.registers[$Z];
  }
});

/**
 * Conditional set if nonzero.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.CSNZ = rgstrsY(function($X, $Y, $Z) {
  if (s($Y).cmp(0) !== 0) {
    this.registers[$X] = this.registers[$Z];
  }
});

/**
 * Conditional set if nonpositive.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.CSNP = rgstrsY(function($X, $Y, $Z) {
  if (s($Y).cmp(0) <= 0) {
    this.registers[$X] = this.registers[$Z];
  }
});

/**
 * Conditional set if even.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.CSEV = rgstrsY(function($X, $Y, $Z) {
  if (s($Y).mod(2).cmp(0) === 0) {
    this.registers[$X] = this.registers[$Z];
  }
});

/**
 * Zero or set if negative.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.ZSN = rgstrsY(function($X, $Y, $Z) {
  this.registers[$X] = s($Y).cmp(0) === -1 ? this.registers[$Z] : zeros;
});

/**
 * Zero or set if zero.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.ZSZ = rgstrsY(function($X, $Y, $Z) {
  this.registers[$X] = s($Y).cmp(0) === 0 ? this.registers[$Z] : zeros;
});

/**
 * Zero or set if positive.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.ZSP = rgstrsY(function($X, $Y, $Z) {
  this.registers[$X] = s($Y).cmp(0) === 1 ? this.registers[$Z] : zeros;
});

/**
 * Zero or set if odd.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.ZSOD = rgstrsY(function($X, $Y, $Z) {
  this.registers[$X] = _.remainder(two, s($Y)).cmp(1) === 0 ? this.registers[$Z] : zeros;
});

/**
 * Zero or set if nonnegative.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.ZSNN = rgstrsY(function($X, $Y, $Z) {
  this.registers[$X] = s($Y).cmp(0) > -1 ? this.registers[$Z] : zeros;
});

/**
 * Zero or set if nonzero.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.ZSNZ = rgstrsY(function($X, $Y, $Z) {
  this.registers[$X] = s($Y).cmp(0) !== 0 ? this.registers[$Z] : zeros;
});

/**
 * Zero or set if nonpositive.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.ZSNP = rgstrsY(function($X, $Y, $Z) {
  this.registers[$X] = s($Y).cmp(0) <= 0 ? this.registers[$Z] : zeros;
});

/**
 * Zero or set if even.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.ZSEV = rgstrsY(function($X, $Y, $Z) {
  this.registers[$X] = s($Y).mod(2).cmp(0) === 0 ? this.registers[$Z] : zeros;
});

/**
 * Bitwise and.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.AND = function($X, $Y, $Z) {
  var y = this.registers[$Y];
  var z = this.registers[$Z];
  var Y = Long.fromString(y, true, 16);
  var Z = Long.fromString(z, true, 16);
  var x = Y.and(Z);

  this.registers[$X] = extendUnsignedTo64(Y.and(Z).toString(16).toUpperCase());
};

/**
 * Bitwise or.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.OR = function($X, $Y, $Z) {
  var Y = Long.fromString(this.registers[$Y], true, 16);
  var Z = Long.fromString(this.registers[$Z], true, 16);

  this.registers[$X] = extendUnsignedTo64(Y.or(Z).toString(16).toUpperCase());
};

/**
 * Bitwise exclusive-or.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.XOR = function($X, $Y, $Z) {
  var Y = Long.fromString(this.registers[$Y], true, 16);
  var Z = Long.fromString(this.registers[$Z], true, 16);

  this.registers[$X] = extendUnsignedTo64(Y.xor(Z).toString(16).toUpperCase());
};

/**
 * Bitwise and-not.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.ANDN = function($X, $Y, $Z) {
  var Y = Long.fromString(this.registers[$Y], true, 16);
  var Z = Long.fromString(this.registers[$Z], true, 16);

  this.registers[$X] = extendUnsignedTo64(Y.and(Z.not()).toString(16).toUpperCase());
};

/**
 * Bitwise or-not.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.ORN = function($X, $Y, $Z) {
  var Y = Long.fromString(this.registers[$Y], true, 16);
  var Z = Long.fromString(this.registers[$Z], true, 16);

  this.registers[$X] = extendUnsignedTo64(Y.or(Z.not()).toString(16).toUpperCase());
};

/**
 * Bitwise not-and.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.NAND = function($X, $Y, $Z) {
  this.AND($X, $Y, $Z);
  this.registers[$X] = extendUnsignedTo64(Long.fromString(this.registers[$X], true, 16).not().toString(16).toUpperCase());
};

/**
 * Bitwise not-or.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.NOR = function($X, $Y, $Z) {
  this.OR($X, $Y, $Z);
  this.registers[$X] = extendUnsignedTo64(Long.fromString(this.registers[$X], true, 16).not().toString(16).toUpperCase());
};

/**
 * Bitwise not-exclusive-or.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.NXOR = function($X, $Y, $Z) {
  this.XOR($X, $Y, $Z);
  this.registers[$X] = extendUnsignedTo64(Long.fromString(this.registers[$X], true, 16).not().toString(16).toUpperCase());
};

module.exports = MMIX;
