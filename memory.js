/** @module memory */
var Big = require('big.js');
var utils = require('./utils');

/**
 * @constructor
 * @alias module:memory
 */
function Memory() {
  this.store = {};
}

/**
 * Returns the byte stored at the address.
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
  if (!(addr instanceof Big)) {
    throw new Error('Address must be a Big');
  }
  this.store[Memory.addressKey(addr)] = data;
};

/**
 * Returns the wyde that contains the byte at the given address.
 * @param {Uint64} addr
 * @return {Hex}
 */
Memory.prototype.getWyde = function(addr) {
  var start = utils.effectiveAddress(2, addr);
  var bytes = [];
  for (var i = 0; i < 2; i++) {
    bytes.push(this.getByte(start.plus(i)));
  }
  return bytes.join('');
};

/**
 * Stores a wyde at the M_2 address containing the given byte address.
 * @param {Hex} data
 * @param {Uint64} addr
 */
Memory.prototype.setWyde = function(data, addr) {
  var start = utils.effectiveAddress(2, addr);

  for (var i = 0; i < 2; i++) {
    this.setByte(data.substring(i*2, (i*2) + 2), start.plus(i));
  }
};

/**
 * Returns the tetra that contains the byte at the given address.
 * @param {Uint64} addr
 * @return {Hex}
 */
Memory.prototype.getTetra = function(addr) {
  var start = utils.effectiveAddress(4, addr);
  var bytes = [];
  for (var i = 0; i < 4; i++) {
    bytes.push(this.getByte(start.plus(i)));
  }
  return bytes.join('');
};

/**
 * Stores a tetra at the M_4 address containing the given byte address.
 * @param {Hex} data
 * @param {Uint64} addr
 */
Memory.prototype.setTetra = function(data, addr) {
  var start = utils.effectiveAddress(4, addr);
  
  for (var i = 0; i < 4; i++) {
    this.setByte(data.substring(i*2, (i*2) + 2), start.plus(i));
  }
};

/**
 * Returns the octabyte that contains the byte at the given address.
 * @param {Uint64} addr
 * @return {Hex}
 */
Memory.prototype.getOcta = function(addr) {
  var start = utils.effectiveAddress(8, addr);

  var bytes = [];
  for (var i = 0; i < 8; i++) {
    bytes.push(this.getByte(start.plus(i)));
  }
  return bytes.join('');
};

/**
 * Stores an octabyte at the M_8 address containing the given byte address.
 * @param {Hex} data
 * @param {Uint64} addr
 */
Memory.prototype.setOcta = function(data, addr) {
  var start = utils.effectiveAddress(8, addr);

  data = utils.extendUnsignedTo64(data);

  for (var i = 0; i < 8; i++) {
    this.setByte(data.substring(i*2, (i*2) + 2), start.plus(i));
  }
};

/**
 * @param {Uint64} addr
 * @return {Hex}
 */
Memory.addressKey = function(addr) {
  return addr.toString(16).toUpperCase();
};

module.exports = Memory;
