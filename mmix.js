/** @module MMIX */
var _ = require('./utils');

/**
 * @constructor
 * @alias module:MMIX
 * @param {Memory} memory
 */
function MMIX(memory) {
  this.memory = memory;
  this.general = {};
  this.special = {};
  this.internal = _.internal;

  for (var i = 0; i < 256; i++) {
    addRegister(this.general, '$' + i);
  }

  ('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    .split('')
    .concat(['BB', 'TT', 'WW', 'XX', 'YY', 'ZZ'])
    .forEach(function(x) {
      addRegister(this.special, 'r' + x);
    });
}

/**
 * Defines a register as an accessor property on an object.
 * @param {Object} registers
 * @param {string} name
 */
function addRegister(registers, name) {
  var bits = _.ZEROS;

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
