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
 * Bitwise multiplex.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.MUX = function($X, $Y, $Z) {
  var Y = Long.fromString(this.registers[$Y], true, 16);
  var Z = Long.fromString(this.registers[$Z], true, 16);
  var rM = Long.fromString(this.registers.rM, true, 16);
  var a = Y.and(rM);
  var b = Z.and(rM.not());

  this.registers[$X] = extendUnsignedTo64(a.or(b).toString(16).toUpperCase());
};

/**
 * Sideways add. Counts the number of bit positions in which register $Y has a 1
 * while register $Z has a 0.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.SADD = function($X, $Y, $Z) {
  var Y = Long.fromString(this.registers[$Y], true, 16);
  var Z = Long.fromString(this.registers[$Z], true, 16);
  var x = Y
    .and(Z.not())
    .toString(2)
    .toUpperCase()
    .split('')
    .reduce(function(n,m) {
      return n + parseInt(m, 10);
    }, 0);

  this.registers[$X] = hexify64(x + '');
};

/**
 * Byte difference.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.BDIF = rgstrsYZ(function($X, $Y, $Z) {
  var diff = b($Y).minus(b($Z));

  this.registers[$X] = diff.cmp(0) === 1 ? hexify64U(diff) : zeros;
});

/**
 * Wyde difference.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.WDIF = rgstrsYZ(function($X, $Y, $Z) {
  var diff = w($Y).minus(w($Z));

  this.registers[$X] = diff.cmp(0) === 1 ? hexify64U(diff) : zeros;
});

/**
 * Tetra difference.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.TDIF = rgstrsYZ(function($X, $Y, $Z) {
  var diff = t($Y).minus(t($Z));

  this.registers[$X] = diff.cmp(0) === 1 ? hexify64U(diff) : zeros;
});

/**
 * Octa difference.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.ODIF = rgstrsYZ(function($X, $Y, $Z) {
  var diff = u($Y).minus(u($Z));

  this.registers[$X] = diff.cmp(0) === 1 ? hexify64U(diff) : zeros;
});

function pairs(A, B) {
  return A.map(function(row, i) {
    return row.map(function(a) {
      return row.map(function(y, j) {
        return [A[i][j], B[j][i]];
      });
    });
  });
}

function reducePairs(fn, C) {
  return C.map(function(row) {
    return row.map(function(pairs) {
      return pairs.map(function(pair) {
        return fn.apply(null, pair);
      });
    });
  });
}

function reducePairedVectors(fn, C) {
  return C.map(function(row) {
    return row.map(function(items) {
      return items.reduce(fn);
    });
  });
}

function matrixToBits(M) {
  var x = '';

  return M
    .map(function(row) {
      return row.join('');
    })
    .join('');
}

var b2h = {
  '0000': '0',
  '0001': '1',
  '0010': '2',
  '0011': '3',
  '0100': '4',
  '0101': '5',
  '0110': '6',
  '0111': '7',
  '1000': '8',
  '1001': '9',
  '1010': 'A',
  '1011': 'B',
  '1100': 'C',
  '1101': 'D',
  '1110': 'E',
  '1111': 'F',
};

function binaryToHex(b) {
  var hs = [];
  for (var i = 0; i < 64; i += 4) {
    var nibble = b.substring(i, i + 4);
    hs.push(b2h[nibble]);
  }
  return hs.join('');
}

function or(a, b) {
  return a | b;
}
function xor(a, b) {
  return a ^ b;
}
function times(a, b) {
  return a * b;
}

/**
 * Multiple or.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.MOR = rgstrsYZ(function($X, $Y, $Z) {
  var Y = m($Y);
  var Z = m($Z);
  var C = reducePairedVectors(times, reducePairs(or, pairs(Y, Z)));

  this.registers[$X] = binaryToHex(matrixToBits(C));
});

/**
 * Multiple xor.
 * @function
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.MXOR = rgstrsYZ(function($X, $Y, $Z) {
  var Y = m($Y);
  var Z = m($Z);
  var C = reducePairedVectors(times, reducePairs(xor, pairs(Y, Z)));

  this.registers[$X] = binaryToHex(matrixToBits(C));
});

function notImplemented(op) {
  return function() {
    throw new Error(op + ' has not been implemented yet.');
  };
}

MMIX.prototype.FADD = notImplemented('FADD');
MMIX.prototype.FSUB = notImplemented('FSUB');
MMIX.prototype.FMUL = notImplemented('FMUL');
MMIX.prototype.FDIV = notImplemented('FDIV');
MMIX.prototype.FREM = notImplemented('FREM');
MMIX.prototype.FSQRT = notImplemented('FSQRT');
MMIX.prototype.FINT = notImplemented('FINT');
MMIX.prototype.FCMP = notImplemented('FCMP');
MMIX.prototype.FEQL = notImplemented('FEQL');
MMIX.prototype.FUN = notImplemented('FUN');
MMIX.prototype.FCMPE = notImplemented('FCMPE');
MMIX.prototype.FEQLE = notImplemented('FEQLE');
MMIX.prototype.FUNE = notImplemented('FUNE');
MMIX.prototype.FIX = notImplemented('FIX');
MMIX.prototype.FIXU = notImplemented('FIXU');
MMIX.prototype.FLOT = notImplemented('FLOT');
MMIX.prototype.FLOTU = notImplemented('FLOTU');
MMIX.prototype.SFLOT = notImplemented('SFLOT');
MMIX.prototype.SFLOTU = notImplemented('SFLOTU');
MMIX.prototype.LDSF = notImplemented('LDSF');
MMIX.prototype.STSF = notImplemented('STSF');

MMIX.prototype.PUSHJ = notImplemented('PUSHJ');
MMIX.prototype.PUSHGO = notImplemented('PUSHGO');
MMIX.prototype.POP = notImplemented('POP');
MMIX.prototype.SAVE = notImplemented('SAVE');
MMIX.prototype.UNSAVE = notImplemented('UNSAVE');

MMIX.prototype.TRIP = notImplemented('TRIP');
MMIX.prototype.TRAP = notImplemented('TRAP');
MMIX.prototype.RESUME = notImplemented('RESUME');

/**
 * Set high wyde.
 * @function
 * @param {Register} $X
 * @param {Hex} YZ - must be a wyde
 */
MMIX.prototype.SETH = function($X, YZ) {
  this.registers[$X] = YZ + '000000000000';
};

/**
 * Set medium high wyde.
 * @param {Register} $X
 * @param {Hex} YZ
 */
MMIX.prototype.SETMH = function($X, YZ) {
  this.registers[$X] = '0000' + YZ + '00000000';
};

/**
 * Set medium low wyde.
 * @param {Register} $X
 * @param {Hex} YZ
 */
MMIX.prototype.SETML = function($X, YZ) {
  this.registers[$X] = '00000000' + YZ + '0000';
};

/**
 * Set low wyde.
 * @param {Register} $X
 * @param {Hex} YZ
 */
MMIX.prototype.SETL = function($X, YZ) {
  this.registers[$X] = '000000000000' + YZ;
};

/**
 * Increase by high wyde.
 * @param {Register} $X
 * @param {Hex} YZ
 */
MMIX.prototype.INCH = rgstrsX(function($X, YZ) {
  var inc = Big(decify(YZ, 16)).times(two.pow(48));

  this.registers[$X.name] = hexify64U(u($X).plus(inc).mod(twoToThe64th));
});

/**
 * Increase by medium high wyde.
 * @param {Register} $X
 * @param {Hex} YZ
 */
MMIX.prototype.INCMH = rgstrsX(function($X, YZ) {
  var inc = Big(decify(YZ, 16)).times(two.pow(32));

  this.registers[$X.name] = hexify64U(u($X).plus(inc).mod(twoToThe64th));
});

/**
 * Increase by medium low wyde.
 * @param {Register} $X
 * @param {Hex} YZ
 */
MMIX.prototype.INCML = rgstrsX(function($X, YZ) {
  var inc = Big(decify(YZ, 16)).times(two.pow(16));

  this.registers[$X.name] = hexify64U(u($X).plus(inc).mod(twoToThe64th));
});

/**
 * Increase by low wyde.
 * @param {Register} $X
 * @param {Hex} YZ
 */
MMIX.prototype.INCL = rgstrsX(function($X, YZ) {
  var inc = Big(decify(YZ, 16));

  this.registers[$X.name] = hexify64U(u($X).plus(inc).mod(twoToThe64th));
});

/**
 * Bitwise or with high wyde.
 * @param {Register} $X
 * @param {Hex} YZ
 */
MMIX.prototype.ORH = function($X, YZ) {
  var w = Long.fromString(YZ, true, 16).shiftLeft(48);
  var x = Long.fromString(this.registers[$X], true, 16);

  this.registers[$X] = extendUnsignedTo64(w.or(x).toString(16).toUpperCase());
};

/**
 * Bitwise or with medium high wyde.
 * @param {Register} $X
 * @param {Hex} YZ
 */
MMIX.prototype.ORMH = function($X, YZ) {
  var w = Long.fromString(YZ, true, 16).shiftLeft(32);
  var x = Long.fromString(this.registers[$X], true, 16);

  this.registers[$X] = extendUnsignedTo64(w.or(x).toString(16).toUpperCase());
};

/**
 * Bitwise or with medium low wyde.
 * @param {Register} $X
 * @param {Hex} YZ
 */
MMIX.prototype.ORML = function($X, YZ) {
  var w = Long.fromString(YZ, true, 16).shiftLeft(16);
  var x = Long.fromString(this.registers[$X], true, 16);

  this.registers[$X] = extendUnsignedTo64(w.or(x).toString(16).toUpperCase());
};

/**
 * Bitwise or with low wyde.
 * @param {Register} $X
 * @param {Hex} YZ
 */
MMIX.prototype.ORL = function($X, YZ) {
  var w = Long.fromString(YZ, true, 16);
  var x = Long.fromString(this.registers[$X], true, 16);

  this.registers[$X] = extendUnsignedTo64(w.or(x).toString(16).toUpperCase());
};

/**
 * Bitwise and-not high wyde.
 * @param {Register} $X
 * @param {Hex} YZ
 */
MMIX.prototype.ANDNH = function($X, YZ) {
  var w = Long.fromString(YZ, true, 16).shiftLeft(48);
  var x = Long.fromString(this.registers[$X], true, 16);

  this.registers[$X] = extendUnsignedTo64(x.and(w.not()).toString(16).toUpperCase());
};

/**
 * Bitwise and-not medium high wyde.
 * @param {Register} $X
 * @param {Hex} YZ
 */
MMIX.prototype.ANDNMH = function($X, YZ) {
  var w = Long.fromString(YZ, true, 16).shiftLeft(32);
  var x = Long.fromString(this.registers[$X], true, 16);

  this.registers[$X] = extendUnsignedTo64(x.and(w.not()).toString(16).toUpperCase());
};

/**
 * Bitwise and-not medium low wyde.
 * @param {Register} $X
 * @param {Hex} YZ
 */
MMIX.prototype.ANDNML = function($X, YZ) {
  var w = Long.fromString(YZ, true, 16).shiftLeft(16);
  var x = Long.fromString(this.registers[$X], true, 16);

  this.registers[$X] = extendUnsignedTo64(x.and(w.not()).toString(16).toUpperCase());
};

/**
 * Bitwsie and-not low wyde.
 * @param {Register} $X
 * @param {Hex} YZ
 */
MMIX.prototype.ANDNL = function($X, YZ) {
  var w = Long.fromString(YZ, true, 16);
  var x = Long.fromString(this.registers[$X], true, 16);

  this.registers[$X] = extendUnsignedTo64(x.and(w.not()).toString(16).toUpperCase());
};

function jump(h) {
  this.jumpTarget = this.at.plus(Big(parseInt(h, 16)).times(4));
}

/**
 * Jump.
 * @param {Hex}
 */
MMIX.prototype.JMP = function(XYZ) {
  jump.call(this, XYZ);
};

/**
 * Go.
 * @param {Register} $X
 * @param {Register} $Y
 * @param {Register} $Z
 */
MMIX.prototype.GO = rgstrsYZ(function($X, $Y, $Z) {
  this.registers[$X] = this.at.plus(4);
  this.jumpTarget = A($Y, $Z);
});

/**
 * Branch if negative.
 * @param {Register} $X
 * @param {Hex} YZ
 */
MMIX.prototype.BN = rgstrsX(function($X, YZ) {
  if (s($X).cmp(0) === -1) {
    jump.call(this, YZ);
  }
});
MMIX.prototype.PBN = MMIX.prototype.BN;

/**
 * Branch if zero.
 * @param {Register} $X
 * @param {Hex} YZ
 */
MMIX.prototype.BZ = rgstrsX(function($X, YZ) {
  if (s($X).cmp(0) === 0) {
    jump.call(this, YZ);
  }
});
MMIX.prototype.PBZ = MMIX.prototype.BZ;

/**
 * Branch if positive.
 * @param {Register} $X
 * @param {Hex} YZ
 */
MMIX.prototype.BP = rgstrsX(function($X, YZ) {
  if (s($X).cmp(0) === 1) {
    jump.call(this, YZ);
  }
});
MMIX.prototype.PBP = MMIX.prototype.BP;

/**
 * Branch if odd.
 * @param {Register} $X
 * @param {Hex} YZ
 */
MMIX.prototype.BOD = rgstrsX(function($X, YZ) {
  if (_.remainder(two, s($X)).cmp(1) === 0) {
    jump.call(this, YZ);
  }
});
MMIX.prototype.PBOD = MMIX.prototype.BOD;

/**
 * Branch if nonnegative.
 * @param {Register} $X
 * @param {Hex} YZ
 */
MMIX.prototype.BNN = rgstrsX(function($X, YZ) {
  if (s($X).cmp(0) > -1) {
    jump.call(this, YZ);
  }
});
MMIX.prototype.PBNN = MMIX.prototype.BNN;

/**
 * Branch if nonzero.
 * @param {Register} $X
 * @param {Hex} YZ
 */
MMIX.prototype.BNZ = rgstrsX(function($X, YZ) {
  if (s($X).cmp(0) !== 0) {
    jump.call(this, YZ);
  }
});
MMIX.prototype.PBNZ = MMIX.prototype.BNZ;

/**
 * Branch if nonpositive.
 * @param {Register} $X
 * @param {Hex} YZ
 */
MMIX.prototype.BNP = rgstrsX(function($X, YZ) {
  if (s($X).cmp(0) !== 0) {
    jump.call(this, YZ);
  }
});
MMIX.prototype.PBNP = MMIX.prototype.BNP;

/**
 * Branch if even.
 * @param {Register} $X
 * @param {Hex} YZ
 */
MMIX.prototype.BEV = rgstrsX(function($X, YZ) {
  if (s($X).mod(2).cmp(0) === 0) {
    jump.call(this, YZ);
  }
});
MMIX.prototype.PBEV = MMIX.prototype.BEV;

/**
 * @param {Array} instructions
 */
MMIX.prototype.loadProgram = function(instructions) {
  var start = new Big(256);
  var memory = this.memory;

  //TODO don't mutate instructions array
  if (instructions[instructions.length - 1] !== '00000000') {
    instructions.push('00000000');
  }

  instructions.forEach(function(instruct, index) {
    memory.setTetra(instruct, start.plus(index * 4));
  });

  return start;
};

/**
 * @param {Object} address - type Big.js address of first instruction
 */
MMIX.prototype.run = function(address) {
  this.at = address.minus(4);
  this.counts = {};
  var self = this;

  var s = highland(function(push, next) {
    var at = self.jumpTarget || self.at.plus(4);
    self.at = at;
    self.jumpTarget = null;
    self.counts[Memory.addressKey(at)] = (self.counts[Memory.addressKey(at)] || 0) + 1;
    var tetra = self.memory.getTetra(at);
    if (tetra === '00000000') {
      push(null, highland.nil);
      return;
    }
    push(null, tetra);
    next();
  });

  return s
    .map(disassemble)
    .doto(function(instruction) {
      self[instruction[0]].apply(self, instruction.slice(1));
    });
};

/**
 *
 */
MMIX.prototype.costs = function() {
  var costs = {};
  for (var a in this.counts) {
    if (this.counts.hasOwnProperty(a)) {
      var op = this.memory.store[a];
      var cost = opcodes.costs[op];
      var count = this.counts[a];
      costs[a] = {oops: cost.oops * count, mems: cost.mems * count};
    }
  }
  return costs;
};

module.exports = MMIX;
