var Big = require('big.js');
var Long = require('long');
var hexa = require('hexa');
var _ = require('highland');
var underscore = require('underscore');
var lodash = require('lodash');

var twoToThe64th = exports.twoToThe64th = Big(2).pow(64);

/**
 * Returns true iff the octa in the given general register is 0.
 * @param {Hex} b - the byte corresponding to a general register
 * @param {State} state
 * @return {boolean}
 */
exports.regIsZero = function(b, state) {
  return genRegOcta(b, state) === '0000000000000000';
};

/**
 * Returns true iff the octa in the given general register is negative.
 * @param {Hex} b - the byte corresponding to a general register
 * @param {State} state
 * @return {boolean}
 */
exports.regIsNeg = function(b, state) {
  return binary(genRegOcta(b, state))[0] === 1;
};

/**
 * Returns true iff the octa in the given general register is positive.
 * @param {Hex} b - the byte corresponding to a general register
 * @param {State} state
 * @return {boolean}
 */
exports.regIsPos = function(b, state) {
  var octa = genRegOcta(b, state);
  return binary(octa)[0] === 0 && octa !== '0000000000000000';
};

/**
 * Returns true iff the signed octa in the specified general register is odd.
 * @param {Hex} b - the byte corresponding to a general register
 * @param {State} state
 * @return {boolean}
 */
exports.regIsOdd = function(b, state) {
  return binary(genRegOcta(b, state)).pop() === 1;
};

/**
 * Batches an array into nested arrays of the given size.
 * @param {number} s - items in each chunk
 * @param {Array} a
 * @return {Array[]}
 */
exports.chunk = function(s, a) {
  var chunked = [];

  for (var i = 0; i < a.length; i += s) {
    chunked.push(a.slice(i, i + s));
  }

  return chunked;
};

exports.curry = _.curry;

exports.omit = function(keys, obj) {
  return underscore.omit(obj, keys);
};

var compose = exports.compose = _.compose;

exports.build = function() {
  var o = {};
  for (var i = 0; i < arguments.length; i += 2) {
    o[arguments[i]] = arguments[i + 1];
  }
  return o;
};

/**
 * Returns the byte in memory at the given address.
 * @param {Hex} address - an octabyte
 * @param {State} state
 */
var loadByte = exports.loadByte = function(address, state) {
  return hexifyByte(state.memory.getByte(address));
};

/**
 * Returns the wyde in memory that contains the byte at the given address.
 * @param {Hex} address - an octabyte; the least significant bit is ignored and
 * treated as 0
 * @param {State} state
 */
var loadWyde = exports.loadWyde = function(address, state) {
  var addr = effectiveAddress(2, bigifyOcta(address));
  return loadByte(octafyBig(addr), state) + loadByte(octafyBig(addr.plus(1)), state);
};

/**
 * Returns the tetra in memory that contains the byte at the given address.
 * @param {Hex} address - an octabyte; the least 2 significant bits will be
 * ignored and treated as 0
 * @param {State} state
 */
var loadTetra = exports.loadTetra = function(address, state) {
  var addr = effectiveAddress(4, bigifyOcta(address));

  return loadWyde(octafyBig(addr), state) + loadWyde(octafyBig(addr.plus(2)), state);
};

/**
 * Returns the octa in memory that contains the byte at the given address.
 * @param {Hex} address - an octabyte; the least 3 significant bits will be
 * ignored and treated as 0
 * @param {State} state
 * @return {Hex}
 */
exports.loadOcta = function(address, state) {
  var addr = effectiveAddress(8, bigifyOcta(address));
  return loadTetra(octafyBig(addr), state) + loadTetra(octafyBig(addr.plus(4)), state);
};

var internals = exports.internals = function() {
  return {
    '@': ZEROS
  };
};

var isGenReg = exports.isGenReg = function(key) {
  if (!/^\$/.test(key)) {
    return false;
  }
  var n = parseInt(key.substring(1), 10);
  return n >= 0 && n <= 255;
}

var isSpecialReg = exports.isSpecialReg = function(key) {
  switch (key.length) {
  case 2:
    return /r[A-Z]/.test(key);
  case 3:
    return /r[A-Z][BTWXYZ]/.test(key);
  }
  return false;
}

var isInternalAttr = exports.isInternalAttr = function(key) {
  return internals().hasOwnProperty(key);
}

var isAddress = exports.isAddress = function(key) {
  return /^[0-9A-F]{16}$/.test(key);
};

/**
 * Uses a diff to update a machine's state.
 * @param {Diff} diff
 * @param {Object} machine
 */
exports.applyDiff = function(diff, machine) {
  for (var p in diff) {
    if (isGenReg(p)) {
      machine.general[p] = diff[p];
      continue;
    }

    if (isSpecialReg(p)) {
      machine.special[p] = diff[p];
      continue;
    }

    if (isInternalAttr(p)) {
      machine.internal[p] = diff[p];
      continue;
    }

    if (isAddress(p)) {
      machine.memory.setByte(parseInt(diff[p], 16), p);
      continue;
    }

    if (p === 'exceptions') {
      continue;
    }
    throw new Error('Unrecognized property in diff: ' + p);
  }

  return machine;
};

/**
 * Gathers the states changed by a diff so it can be reversed.
 * @param {Diff} diff
 * @param {Object} machine
 * @return {Diff}
 */
exports.diffChanges = function(diff, machine) {
  var changed = {};

  for (var p in diff) {
    if (isGenReg(p)) {
      changed[p] = machine.general[p];
      continue;
    }

    if (isSpecialReg(p)) {
      changed[p] = machine.special[p];
      continue;
    }

    if (isInternalAttr(p)) {
      changed[p] = machine.internal[p];
      continue;
    }

    if (isAddress(p)) {
      changed[p] = machine.memory.getByte(p).toString(16);
      continue;
    }

    if (p === 'exceptions') {
      changed.rA = machine.special.rA;
      continue;
    }
    throw new Error('Unrecognized property in diff: ' + p);
  }

  return changed;
};

/**
 * Returns the side effects that result from the diff returned by a computation.
 * Rules:
 * 1. If a marginal register is set in the original diff set rL.
 * 2. If the original diff does not set @, step @.
 * 3. If the original diff includes exceptions, set rA.
 */
exports.diffEffects = function(diff, machine) {
  var effects = {};

  //1. If a marginal register is set in the original diff set rL.
  var L = parseInt(machine.special.rL, 16);
  var G = parseInt(machine.special.rG, 16);
  var maxX;

  for (var p in diff) {
    if (isGenReg(p)) {
      var x = parseInt(p.substring(1), 10);

      //is the register being set marginal?
      if (L <= x && x < G) {
        maxX = Math.max((maxX || 0), x);
      }
    }
  }
  if (typeof maxX === 'number') {
    effects.rL = extendUnsignedTo64((maxX + 1).toString(16));
  }

  //2. If the original diff does not set @, step @.
  if (!diff['@']) {
    effects['@'] = step(machine);
  }

  //3. If the original diff includes exceptions, set rA.
  //no trips yet so assume rA is zeroed
  if (diff.exceptions) {
    //TODO existing exceptions in rA?
    effects.rA = extendUnsignedTo64(parseInt(diff.exceptions, 2).toString(16).toUpperCase());
  }

  return effects;
}

/**
 * Non-mutating extend.
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 */
exports.extend = _.extend;

/**
 * Returns the first byte of an instruction.
 * @param {Hex} tetra
 * @return {Hex}
 */
var OP = exports.OP = function(tetra) {
  return tetra.substring(0, 2);
};

/**
 * Returns the second byte of an instruction.
 * @param {Hex} tetra
 * @return {Hex}
 */
var X = exports.X = function(tetra) {
  return tetra.substring(2, 4);
};

/**
 * Return the third byte of an instruction.
 * @param {Hex} tetra
 * @return {Hex}
 */
var Y = exports.Y = function(tetra) {
  return tetra.substring(4, 6);
};

/**
 * Returns the fourth byte of a tetra.
 * @param {Hex} tetra
 * @return {Hex}
 */
var Z = exports.Z = function(tetra) {
  return tetra.substring(6, 8);
};

/**
 * Returns true iff the operation stores data to memory.
 * Used by TRIP and RESUME.
 * @param {Hex} b
 * @return {boolean}
 */
exports.opDoesStore = function(b) {
  var n = parseInt(b, 16);

  return n >= 160 && n <= 183;
};

/**
 * Calculate a memory address by summing two registers.
 * @param {Register} $Y
 * @param {Register} $Z
 * @return {Int}
 */
exports.A = function(state, Y, Z) {
  var bigY = regUint64(Y, state);
  var bigZ = regUint64(Z, state);
  var address = bigY.plus(bigZ);

  address = address.mod(twoToThe64th);
  return octafyBig(address);
};

/**
 * Calculate a memory address by summing a register and a byte.
 * @param {Register} $Y
 * @param {Register} Z
 */
exports.AI = function(state, Y, Z) {
  return octafyBig(regUint64(Y, state).plus(decifyByte(Z)).mod(twoToThe64th));
};

/**
 * Deprecated. This should be named regUint since it casts to a Big.js.
 * Fetches the octa in a register identified by a byte and casts it to a Uint64.
 * @param {State} state
 * @param {Hex} b
 * @return {Uint64}
 */
var regUint64 = exports.regUint64 = function(b, state) {
  return bigifyOcta(genRegOcta(b, state));
};

/**
 * Fetches the octa in a general register and casts it to a Uint64.
 * @param {Hex} b
 * @param {State} state
 * @return {Uint64} Long.js
 */
exports.regToUint64 = function(b, state) {
  return Long.fromString(genRegOcta(b, state), true, 16);
};

/**
 * Fetches the octa in a special register and casts it to a Uint64.
 * @param {string} r - the name of the special register e.g. "rM"
 * @param {State} state
 * @return {Uint64} Long.js
 */
exports.specialToUint64 = function(r, state) {
  return Long.fromString(specialRegOcta(r, state), true, 16);
};

exports.specialToUint = function(r, state) {
  return bigifyOcta(specialRegOcta(r, state));
};

var int64 = exports.int64 = function(octa) {
  return Long.fromString(octa, false, 16);
};

/**
 * @param {Hex} b
 * @return {Uint}
 */
exports.byteToUint = function(b) {
  return Big(parseInt(b, 16));
};

/**
 * Converts a byte or wyde to a Uint64 (Long.js).
 * @param {Hex} b
 * @return {Uint64}
 */
var hexToUint64 = exports.byteToUint64 = exports.wydeToUint64 = exports.tetraToUint64 = exports.octaToUint64 = function(b) {
  return Long.fromString(b, true, 16);
};

/**
 * Converts a byte or wyde to an Int64 (Long.js).
 * @param {Hex} b
 * @return {Int64}
 */
exports.byteToInt64 = function(b) {
  return Long.fromString(b, false, 16);
};

var octaIsNegative = exports.octaIsNegative = function(octa) {
  return octa.length === 16 && /^[89A-F]/.test(octa);
};

/**
 * Returns the signed integer corresponding to 16 hexadecimal digits.
 * @param {Hex} octa
 * @return {Int}
 */
var octaToInt = exports.octaToInt = function(octa) {
  var big = bigifyOcta(octa);

  return octaIsNegative(octa) ? big.minus(twoToThe64th) : big;
};

/**
 * Returns a Big.js Uint64.
 * @param {Hex} octa
 * @return {Uint64}
 */
var bigifyOcta = exports.bigifyOcta = function(octa) {
  return Big(decifyOcta(octa));
};

/**
 * Returns an octabyte representing a Big.js Uint64.
 * @param {Uint64} big
 * @return {Hex}
 */
var octafyBig = exports.octafyBig = function(big) {
  return hexify64(big.toString());
};

/**
 * Returns @ plus 4.
 * @param {State} state
 * @return {Hex}
 */
exports.atStep = function(state) {
  return uint64ToOcta(atUint64(state).add(4));
};

/**
 * Returns the instruction tetra from '@'.
 * @param {State} state
 * @return {Hex} the tetra instruction
 */
var atInstruction = exports.atInstruction = function(state) {
  return loadTetra(atAddress(state), state);
};

/**
 * Returns the current '@' address.
 * @param {State} state
 * @return {Hex} an octabyte address
 */
var atAddress = exports.atAddress = function(state) {
  return state.internal['@'];
};

/**
 * Returns the relative address forward.
 * @param {State}
 * @param {Hex} h - a wyde or triple byte unsigned
 * @return {Hex} an octabyte
 */
var RA = exports.RA = function(h, state) {
  return uint64ToOcta(atUint64(state).add(hexToUint64(h).multiply(4)));
};

var step = exports.step = function(state) {
  return RA('01', state);
};

/**
 * Returns the relative address backward.
 * @param {State}
 * @param {Hex} h - a wyde or triple byte unsigned
 * @return {Hex} an octabyte
 */
exports.RAB = function(h, state) {
  return uint64ToOcta(atUint64(state).subtract(hexToUint64(h).multiply(4)));
};

/**
 * Returns @ + (4*wyde) - 2^18
 */
exports.jumpBackWyde = function(state, wyde) {
  var XY = Long.fromString(wyde, true, 16).multiply(4);

  return uint64ToOcta(atUint64(state).add(XY).subtract(262144));
};

/**
 * returns the constant "0000000000000000".
 * @return {Hex}
 */
var ZEROS = exports.ZEROS = '0000000000000000';

/**
 * Returns the octabyte contents of a general register identified by a byte.
 * @param {Hex} b - e.g. "FF" to get the contents of $255 or "00" for $0
 * @param {State} state
 * @return {Hex} this is simply data - signed vs. unsigned is meaningless here
 */
var genRegOcta = exports.genRegOcta = function(b, state) {
  return state.general[genRegKey(b)];
};

/**
 * Returns the octabyte contents of a specia register identified by name.
 * @param {string} r e.g. 'rM' or 'rXX'
 * @param {State} state
 * @return {Hex}
 */
var specialRegOcta = exports.specialRegOcta = function(r, state) {
  return state.special[r];
};

exports.specialRegUint = function(r, state) {
  return bigifyOcta(specialRegOcta(r, state));
};

/**
 * Executes an instruction against a state.
 * @param {Hex} tetra - the four byte instruction
 * @param {State} state
 * @return {Diff}
 */
exports.execute = function(tetra, state) {
  //circular dependency
  return require('./ops').ops[parseInt(OP(tetra), 16)](state, X(tetra), Y(tetra), Z(tetra));
};

/**
 * Returns the key in a state object for accesing a general register
 * corresponding to a byte value.
 * e.g. '00' => $0, 'FF' => $255
 * @param {Hex} b
 * @return {String}
 */
var genRegKey = exports.genRegKey = function(b) {
  return '$' + decifyByte(b);
};

/**
 * @param {ByteWidth} byteWidth
 * @param {Uint} addr
 * @return {Uint}
 */
var effectiveAddress = exports.effectiveAddress = function(byteWidth, addr) {
  return addr.minus(addr.mod(byteWidth));
};

/**
 * The quotient of y divided by z is the floor of y/z.
 * @param {Int} divisor
 * @param {Int} n
 * @return {Int}
 */
var quotient = exports.quotient = function(divisor, n) {
  var q = n.div(divisor);

  //floor
  return q.cmp(0) === -1 ? q.round(0, 3) : q.round(0, 0);
};

/**
 * The reminader of y divided by z is y - quotient(y/z) * z.
 * @param {Int} divisor
 * @param {Int} n
 * @return {Int}
 */
var remainder = exports.remainder = function(divisor, n) {
  var q = quotient(divisor, n);

  return n.minus(q.times(divisor));
};

/**
 * @param {Int64} divisor
 * @param {Int64} n
 * @return {Int64}
 */
var quotient64 = exports.quotient64 = function(divisor, n) {
  //TODO floor
  var q = n.div(divisor);

  if (q.multiply(divisor).lessThanOrEqual(n)) {
    return q;
  }
  q = q.subtract(1);
  if (q.multiply(divisor).lessThanOrEqual(n)) {
    return q;
  }
  throw new Error(['Fix quotient64 implementation for divisor and dividend', divisor, n].join(' '));
};

/**
 * @param {Int64} divisor
 * @param {Int64} n
 * @return {Int64}
 */
var remainder64 = exports.remainder64 = function(divisor, n) {
  var q = quotient64(divisor, n);

  return n.subtract(q.multiply(divisor));
};

exports.decify = hexa.decify;

/**
 * Returns the decimal equivalent of an unsigned hexadecimal byte.
 * @param {Hex} b
 * @return {String}
 */
var decifyByte = exports.decifyByte = hexa.decifyByte;

/**
 * Returns the decimal equivalent of an unsigned hexadecimal octabyte.
 * @param {Hex} octa
 * @return {String}
 */
var decifyOcta = exports.decifyOcta = function(octa) {
  return hexa.decify(octa, 64, false);
};

exports.u = function($R) {
  return $R.unsigned();
};

exports.s = function($R) {
  return $R.signed();
};

/**
 * Returns the two's complement hexadecimal digits for an Int64.
 * Overflow checks should be performed in the calling code as needed.
 * @param {Int64} i64
 * @return {Hex}
 */
exports.int64ToByte = function(i64) {
  return hexifyByte(remainder64(Long.fromInt(256), i64));
};

/**
 * Two's complement wyde from an Int64.
 * @param {Int64} n
 * @return {Hex}
 */
exports.int64ToWyde = function(n) {
  return hexifyWyde(remainder64(Long.fromInt(65536), n));
};

/**
 * Two's complement tetra from an Int64.
 * @param {Int64} n
 * @return {Hex}
 */
exports.int64ToTetra = function(n) {
  return hexifyTetra(remainder64(Long.fromString('4294967296'), n));
};

/**
 * Returns true iff an int64 is outside the range -128 to +127.
 * @param {Int64} i
 * @return {boolean}
 */
exports.int64Overflows8 = function(i) {
  return i.greaterThanOrEqual(Long.fromInt(127)) ||
    i.lessThanOrEqual(Long.fromInt(-128));
};

/**
 * Returns true iff an int64 is outside the range -32768 and 32767.
 * @param {Int64} n
 * @return {boolean}
 */
exports.int64Overflows16 = function(n) {
  return n.greaterThanOrEqual(Long.fromInt(32767)) ||
    n.lessThanOrEqual(Long.fromInt(-32768));
};

/**
 * Returns true iff an int 64 is outside the range -2147483648 and 2147483647.
 * @param {Int64} n
 * @return {boolean}
 */
exports.int64Overflows32 = function(n) {
  return n.greaterThanOrEqual(Long.fromInt(2147483647)) ||
    n.lessThanOrEqual(Long.fromInt(-2147483648));
};

/**
 * Returns true iff a big is outside the range -2^63 and 2^63 - 1.
 * @param {Int} n
 * @return {boolean}
 */
exports.bigOverflows64 = function(n) {
  return n.gte(Big(2).pow(63)) || n.lt(Big(-2).pow(63));
};

var hexifyByte = exports.hexifyByte = exports.hexify8U = function(deci) {
  var d = parseInt(deci, 10) % 256;
  var h = d.toString(16).toUpperCase();

  return h.length === 1 ? '0' + h : h;
};

var hexifyWyde = exports.hexifyWyde = exports.hexify16U = function(deci) {
  var d = parseInt(deci, 10) % 65536;
  var h = d.toString(16).toUpperCase();

  return ('0000' + h).slice(h.length);
};

exports.hexifyTripleByte = exports.hexify24U = function(deci) {
  var d = parseInt(deci, 10) % 16777216;
  var h = d.toString(16).toUpperCase();

  return ('000000', + h).slice(h.length);
};

var hexifyTetra = exports.hexifyTetra = exports.hexifyTetra = function(deci) {
  var d = parseInt(deci, 10) % 4294967296;
  var h = d.toString(16).toUpperCase();
  
  return ('00000000' + h).slice(h.length);
};

var hexify64 = exports.hexify64 = function(deci) {
  if (deci instanceof Big) {
    return hexa.hexify(deci.toFixed(), 64);
  }
  return hexa.hexify(deci, 64);
};

exports.hexify64U = function(deci) {
  if (deci instanceof Big) {
    return hexify64(remainder(twoToThe64th, deci));
  }
  throw new Error('hexify64U is only implemented for Bigs');
};

var hexify128 = exports.hexify128 = function(deci) {
  if (deci instanceof Big) {
    return hexa.hexify(deci.toFixed(), 128);
  }
  return hexa.hexify(deci, 128);
};

exports.hexify128U = (function() {
  var modTwo128 = _.curry(remainder, Big(2).pow(128));

  return function(big) {
    if (big instanceof Big) {
      return hexify128(modTwo128(big));
    }
    throw new Error('hexify128U is only implemented for Bigs');
  };
})();

var extendUnsignedTo64 = exports.extendUnsignedTo64 = function(hex) {
  return hexa.pad0Octa(hex);
};

exports.signExtend8To64 = function(hex) {
  return hexa.signExtend64(8, hex);
};

exports.signExtend16To64 = function(hex) {
  return hexa.signExtend64(16, hex);
};

exports.signExtend32To64 = function(hex) {
  return hexa.signExtend64(32, hex);
};

/**
 * Converts a Uint64 (Long.js) to an octabyte.
 * @param {Uint64} n
 * @return {Hex}
 */
var uint64ToOcta = exports.uint64ToOcta = function(n) {
  return extendUnsignedTo64(n.toString(16).toUpperCase());
};

/**
 * Returns the hex constant byte for a general purpose register.
 * @param {string} $X - e.g. $0 or $255
 * @return {Hex}
 */
exports.registerToHex = function($X) {
  return hexifyByte($X.slice(1));
};

/**
 * Fetches the octa in a register and casts it to a signed big Int.
 * @param {Hex} b
 * @param {State} state
 * @return {Int}
 */
exports.regToInt = _.compose(octaToInt, genRegOcta);

exports.regToUint = function(b, state) {
  var octa = genRegOcta(b, state);
  return bigifyOcta(octa);
};

exports.specialRegToUint = function(r, state) {
  return bigifyOcta(specialRegOcta(r, state));
};

exports.regToInt64 = function(b, state) {
  return Long.fromString(genRegOcta(b, state), false, 16);
};

/**
 * Fetches the octa in a register and casts it to a Big signed Int.
 * @param {Hex} b
 * @param {State} state
 * @return {Int}
 */
var regToBig = exports.regToBig = _.compose(bigifyOcta, genRegOcta);

var binary = exports.binary = (function() {
  var map =  {
    '0': [0, 0, 0, 0],
    '1': [0, 0, 0, 1],
    '2': [0, 0, 1, 0],
    '3': [0, 0, 1, 1],
    '4': [0, 1, 0, 0],
    '5': [0, 1, 0, 1],
    '6': [0, 1, 1, 0],
    '7': [0, 1, 1, 1],
    '8': [1, 0, 0, 0],
    '9': [1, 0, 0, 1],
    'A': [1, 0, 1, 0],
    'B': [1, 0, 1, 1],
    'C': [1, 1, 0, 0],
    'D': [1, 1, 0, 1],
    'E': [1, 1, 1, 0],
    'F': [1, 1, 1, 1]
  };

  return function(hex) {

    return hex
      .split('')
      .reduce(function(memo, H) {
        return memo.concat(map[H]);
      }, []);
  };
})();

var matrix = exports.matrix = function(octa) {
  var bits = binary(octa);

  return [
    bits.slice(0, 8),
    bits.slice(8, 16),
    bits.slice(16, 24),
    bits.slice(24, 32),
    bits.slice(32, 40),
    bits.slice(40, 48),
    bits.slice(48, 56),
    bits.slice(56)
  ];
};

exports.matrixT = function(octa) {
  var _ = lodash;
  var bits = binary(octa);
  var byteIndices = [0, 8, 16, 24, 32, 40, 48, 56];

  var offset = function(n) {
    return _.map(byteIndices, function(i) {
      return i + n;
    });
  };

  return [
    _.at(bits, byteIndices),
    _.at(bits, offset(1)),
    _.at(bits, offset(2)),
    _.at(bits, offset(3)),
    _.at(bits, offset(4)),
    _.at(bits, offset(5)),
    _.at(bits, offset(6)),
    _.at(bits, offset(7)),
  ];
};

/**
 * If A is an m X n matrix and B is an n X p matrix, returns a new m X p matrix
 * where each entry is an array of pairs.
 */
exports.pairs = function(A, B) {
  var m = A.length;
  var p = B[0].length;
  var C = [];

  for (var i = 0; i < p; i++) {
    C[i] = [];

    for (var j = 0; j < m; j++) {
      C[i][j] = [A[i], B[j]];
    }
  }

  return C;
};

exports.pair = function(C, fn) {
  return C.map(function(row) {
    return row.map(function(entry) {
      return entry[0].map(function(e, i) {
        return fn(e, entry[1][i]);
      });
    });
  });
};

exports.reducePairedVectors = function reducePairedVectors(fn, C) {
  return C.map(function(row) {
    return row.map(function(items) {
      return items.reduce(fn);
    });
  });
};

exports.reducePairs = function reducePairs(fn, C) {
  return C.map(function(row) {
    return row.map(function(pairs) {
      return pairs.map(function(pair) {
        return fn.apply(null, pair);
      });
    });
  });
};

exports.matrixTOcta = function(M) {
  var bits = [];

  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      var index = (i * 8) + j;
      bits[index] = M[j][i];
    }
  }

  return bits;
};

exports.matrixToBits = function matrixToBits(M) {
  var x = '';

  return M
    .map(function(row) {
      return row.join('');
    })
    .join('');
};

exports.or = function or(a, b) {
  return a | b;
};

exports.xor = function xor(a, b) {
  return a ^ b;
};

exports.times = function times(a, b) {
  return a * b;
};

/**
 * Returns the current '@' address as a Uint64.
 * @param {State} state
 * @return {Uint64}
 */
var atUint64 = exports.atUint64 = compose(hexToUint64, atAddress);

exports.binaryToHex = function(bits) {
  return extendUnsignedTo64(Long.fromString(bits, true, 2).toString(16).toUpperCase());
};
