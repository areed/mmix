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

/**
 * Load the byte at memory address Y + Z into register X.
 * @param {Register} X
 * @param {Octabyte} Y
 * @param {Octabyte} Z
 */
MMIX.prototype.LDB = function(X, Y, Z) {
  if (typeof registers[X] === 'undefined') {
    throw new Error('The machine does not have a register named ' + X);
  }
  if (typeof Y !== 'string' || Y.length !== 2) {
    throw new Error(Y + ' should be a single byte hex string.');
  }
  if (typeof Z !== 'string' || Z.length !== 2) {
    throw new Error(Z + ' should be a single byte hex string.');
  }
 
  var y = uint64(Y);
  var z = uint64(Z);
  var A = address(y.add(z));
  this.registers[X] = this.memory[A];
};

/**
 * Load the wyde at memory address Y + Z into register X.
 * @param {Register} X
 * @param {Octabyte} Y
 * @param {Octabyte} Z
 */
MMIX.prototype.LDW = function(X, Y, Z) {
  if (typeof registers[X] === 'undefined') {
    throw new Error('The machine does not have a register named ' + X);
  }
  if (typeof Y !== 'string' || Y.length !== 2) {
    throw new Error(Y + ' should be a single byte hex string.');
  }
  if (typeof Z !== 'string' || Z.length !== 2) {
    throw new Error(Z + ' should be a single byte hex string.');
  }

  var y = uint64(Y);
  var z = uint64(Z);
  var A = y.add(z);
  var offset = A.modulo(2);
  var effective = A.subtract(offset);
  var A1 = address(effective);
  var A2 = address(effective.add(1));
  var data = this.memory[A1] + this.memory[A2];
  var isNegative = /^[89ABCDEF]/.test(data);
  this.registers[X] = isNegative ? padSignedOcta(data) : padOcta(data);
};

module.exports = MMIX;
