/** @module mmix */
var Long = require('long');
var registers = require('./registers');

var int64 = function(hex) {
  return Long.fromString(hex, false, 16);
};
var uint64 = function(hex) {
  return Long.fromString(hex, true, 16);
};

var padOcta = (function() {
  var d = '0000000000000000';

  return function(s) {
    return d.split('').concat(s.split('')).slice(s.length).join('');
  };
})();

var padSignedOcta = (function() {
  var d = 'FFFFFFFFFFFFFFFF';

  return function(s) {
    return d.split('').concat(s.split('')).slice(s.length).join('');
  };
})();

var address = function(l) {
  return padOcta(l.toString(16));
};

/**
 * @typedef {string} Octabyte - Hex
 */

/**
 * @constructor
 * @alias module:mmix
 */
function MMIX() {
  var memory = this.memory = {};
  this.memory.setByte = function(data, addr) {
    if (data.length !== 2) {
      throw new Error('Setting a byte memory requires a 1 byte valute.');
    }
    memory[addr] = data;
  };
  this.memory.setOcta = function(data, addr) {
    data = padOcta(data);
    var l = uint64(addr);
    var offset = l.modulo(8);
    var effective = l.subtract(offset);
    for (var i = 0; i < 8; i++) {
      var d = data.substring(i*2, (i*2) + 2);
      memory.setByte(d, address(effective.add(i)));
    }
  };
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

    var A = uint64(Y).add(uint64(Z));
    var offset = A.modulo(byteWidth);
    var startAddress = A.subtract(offset);
    var bytes = [];
    for (var i = 0; i < byteWidth; i++) {
      bytes.push(this.memory[address(startAddress.add(i))]);
    }
    var data = bytes.join('');
    var isNegative = unsigned ? false : /^[89ABCDEF]/.test(data);
    this.registers[X] = isNegative ? padSignedOcta(data) : padOcta(data);
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

module.exports = MMIX;
