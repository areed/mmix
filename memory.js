/** @module memory */
var utils = require('./utils');
var Long = require('long');

/**
 * @constructor
 * @alias module:memory
 */
function Memory() {
  this.store = {};
}

/**
 * Returns the byte stored at a given address.
 * @param {Uint64} addr
 * @return {Hex}
 */
Memory.prototype.getByte = function(addr) {
  return this.store[Memory.addressKey(addr)] || '00';
};

/**
 * Stores a byte at the given address.
 * @param {Hex} data
 * @param {Uint64} addr
 */
Memory.prototype.setByte = function(data, addr) {
  if (data.length !== 2) {
    throw new Error('Setting a single memory cell requires 1 byte of data.');
  }
  if (!(addr instanceof Long)) {
    throw new Error('Address must be a Long');
  }
  this.store[Memory.addressKey(addr)] = data;
};

/**
 * Stores an octabyte at the Mem8 address holding the given address.
 * @param {Hex} data
 * @param {Uint64} addr
 */
Memory.prototype.setOcta = function(data, addr) {
  var start = Memory.effectiveAddress(8, utils.uint64(addr));

  data = utils.padOcta(data);

  for (var i = 0; i < 8; i++) {
    this.setByte(data.substring(i*2, (i*2) + 2), start.add(i));
  }
};

/**
 * @param {number} byteWidth - 1, 2, 4, or 8
 * @param {Uint64} addr
 * @return {Uint64}
 */
Memory.effectiveAddress = function(byteWidth, addr) {
  return addr.subtract(addr.modulo(byteWidth));
};

/**
 * @param {Uint64} addr
 * @return {Octabyte}
 */
Memory.addressKey = function(addr) {
  return addr.toString(16).toUpperCase();
};

module.exports = Memory;
