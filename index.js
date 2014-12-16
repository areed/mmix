/** @module mmix */
var registers = require('./registers');
var utils = require('./utils');
var Memory = require('./Memory');

/**
 * @typedef {string} Octabyte - Hex
 */

/**
 * @constructor
 * @alias module:mmix
 */
function MMIX(memory) {
  this.memory = memory;
  this.registers = {};
}

var LD = function(byteWidth, unsigned) {
  return function(X, Y, Z) {
    if (typeof registers[X] === 'undefined') {
      throw new Error('The machine does not have a register named ' + X);
    }
    if (typeof Y !== 'string' || Y.length !== 2) {
      throw new Error(Y + ' should be a single byte hex string.');
    }
    if (typeof Z !== 'string' || Z.length !== 2) {
      throw new Error(Z + ' should be a single byte hex string.');
    }

    var A = utils.uint64(Y).add(utils.uint64(Z));
    var start = Memory.effectiveAddress(byteWidth, A);
    var bytes = [];
    for (var i = 0; i < byteWidth; i++) {
      bytes.push(this.memory.getByte(start.add(i)));
    }
    var data = bytes.join('');
    var isNegative = unsigned ? false : /^[89ABCDEF]/.test(data);
    this.registers[X] = isNegative ? utils.padSignedOcta(data) : utils.padOcta(data);
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


module.exports = MMIX;
