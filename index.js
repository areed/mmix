/** @module mmix */
var Long = require('long');
var registers = require('./registers');

var int64 = function(hex) {
  return Long.fromString(hex, false, 16);
};
var uint64 = function(hex) {
  return Long.fromString(hex, true, 16);
};

var d = '0000000000000000';

var padOcta = function(s) {
  return d.split('').concat(s.split('')).slice(s.length).join('');
};

/**
 * @typedef {string} Octabyte - Hex
 */

/**
 * @constructor
 * @alias module:mmix
 */
function MMIX() {
  this.memory = {};
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
  var address = padOcta(y.add(z).toString(16));
  this.registers[X] = this.memory[address];
};

module.exports = MMIX;
