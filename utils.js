var Big = require('big.js');
var hexa = require('hexa');
var _ = require('highland');

var twoToThe64th = Big(2).pow(64);

var internals = {};
internals['@'] = true;

function isGenReg(key) {
  if (!/^\$/.test(key)) {
    return false;
  }
  var n = parseInt(key.substring(1), 10);
  return n >= 0 && n <= 255;
}

function isSpecialReg(key) {
  switch (key.length) {
  case 2:
    return /r[A-Z]/.test(key);
  case 3:
    return /r[A-Z][BTWXYZ]/.test(key);
  }
  return false;
}

function isInternalAttr(key) {
  return internals.hasOwnProperty(key);
}

function isAddress(key) {
  return /^[0-9A-F]{16}$/.test(key);
}

/**
 * Uses a diff to update a machine's state.
 * @param {Diff} diff
 * @param {Object} machine
 */
exports.applyDiff = function(diff, machine) {
  for (var p in diff) {
    if (machine.hasOwnProperty(p)) {
      if (isGenReg(p)) {
        machine[p] = diff[p];
        break;
      }

      if (isSpecialReg(p)) {
        machine[p] = diff[p];
        break;
      }

      if (isInternalAttr(p)) {
        machine[p] = diff[p];
        break;
      }

      if (isAddress(p)) {
        machine.memory.setByte(diff[p], p);
        break;
      }
    }
  }

  return machine;
};

/**
 * Non-mutating extend.
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 */
exports.extend = require('highlandx/extend');

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
  return octafyBig(regUint64(Y, state).plus(regUint64(Z, state)).mod(twoToThe64th));
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
 * Fetches the octa in a register identified by a byte and casts it to a Uint64.
 * @param {State} state
 * @param {Hex} b
 * @return {Uint64}
 */
var regUint64 = exports.regUint64 = function(b, state) {
  return bigifyOcta(genRegOcta(b, state));
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
  return hexify64(bigifyOcta(state['@']).plus(4));
};

/**
 * Returns the key of a cell in the state's memory object.
 * @param {Hex} octa
 * @return {String}
 */
exports.memKey = function(hex) {
  if (hex.length !== 16) {
    throw new Error('memKey expects an octa, got: ' + hex);
  }
  return hex;
};

/**
 * Returns the instruction tetra from '@'.
 * @param {State} state
 * @return {Hex} the tetra instruction
 */
exports.atInstruction = function(state) {
  return state[state['@']];
};

/**
 * returns the constant "0000000000000000".
 * @return {Hex}
 */
exports.ZEROS = '0000000000000000';

/**
 * returns the octabyte contents of a general register identified by a byte.
 * @param {State} state
 * @param {Hex} b - e.g. "FF" to get the contents of $255 or "00" for $0
 * @return {Hex} this is simply data - signed vs. unsigned is meaningless here
 */
var genRegOcta = exports.genRegOcta = function(b, state) {
  return state[genRegKey(b)];
};

/**
 * Executes an instruction against a state.
 * @param {Hex} tetra - the four byte instruction
 * @param {State} state
 * @return {Diff}
 */
exports.execute = function(tetra, state) {
  //circular dependency
  return require('./opcodes').ops[parseInt(OP(tetra), 16)](state, X(tetra), Y(tetra), Z(tetra));
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
exports.effectiveAddress = function(byteWidth, addr) {
  return addr.minus(addr.mod(byteWidth));
};

/**
 * @param {Int} n
 * @return {Int}
 */
var quotient = exports.quotient = function(divisor, n) {
  var q = n.div(divisor);

  return n.cmp(0) === -1 ? q.round(0, 3) : q.round(0, 0);
};

/**
 * @param {Int} divisor
 * @param {Int} n
 * @return {Int}
 */
var remainder = exports.remainder = function(divisor, n) {
  var q = quotient(divisor, n);

  return n.minus(q.times(divisor));
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

var hexifyByte = exports.hexifyByte = exports.hexify8U = function(deci) {
  var d = parseInt(deci, 10) % 256;
  var h = d.toString(16).toUpperCase();

  return h.length === 1 ? '0' + h : h;
};

exports.hexifyWyde = exports.hexify16U = function(deci) {
  var d = parseInt(deci, 10) % 65536;
  var h = d.toString(16).toUpperCase();

  return ('0000' + h).slice(h.length);
};

exports.hexifyTripleByte = exports.hexify24U = function(deci) {
  var d = parseInt(deci, 10) % 16777216;
  var h = d.toString(16).toUpperCase();

  return ('000000', + h).slice(h.length);
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

exports.extendUnsignedTo64 = function(hex) {
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
 * Returns the hex constant byte for a general purpose register.
 * @param {string} $X - e.g. $0 or $255
 * @return {Hex}
 */
exports.registerToHex = function($X) {
  return hexifyByte($X.slice(1));
};
