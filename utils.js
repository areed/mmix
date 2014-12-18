var Long = require('long');
var Big = require('big.js');

/**
 * Converts a hex string to a signed Long.
 * @param {Hex} hex
 * @return {Int64}
 */
exports.int64 = function(hex) {
  return Long.fromString(hex, false, 16);
};

/**
 * Converts a hex string to an unsigned Long.
 * @param {Hex} hex
 * @return {Uint64}
 */
exports.uint64 = function(hex) {
  return Long.fromString(hex, true, 16);
};

/** Pads a hex string with leading 0's if less than 16 characters.
 * @param {Hex} hex
 * @return {Hex}
 */
var padOcta = exports.padOcta = (function() {
  var d = '0000000000000000';

  return function(s) {
    return d.split('').concat(s.split('')).slice(s.length).join('');
  };
})();

/**
 * Pads a hex string with leadings 1's if less than 16 characters.
 * @param {Hex} hex
 * @return {Hex}
 */
var padNegativeOcta = exports.padNegativeOcta = (function() {
  var d = 'FFFFFFFFFFFFFFFF';

  return function(s) {
    return d.split('').concat(s.split('')).slice(s.length).join('');
  };
})();

/**
 * Sign-extends a byte, wyde, or tetra to an octa.
 * @param {Hex} hex
 * @return {Hex}
 */
exports.signExtend = function(byteWidth, h) {
  var padded = padOcta(h).toUpperCase();
  var fixed = padded.substring(16 - (byteWidth * 2));
  return /^[89ABCDEF]/.test(fixed) ? padNegativeOcta(fixed) : padded;
};

/**
 * @param {number} byteWidth - 1, 2, 4, or 8
 * @param {Uint64} addr
 * @return {Uint64}
 */
exports.effectiveAddress = function(byteWidth, addr) {
  return addr.subtract(addr.modulo(byteWidth));
};

/**
 * Stringifies a Uint64 to a standard format.
 * @param {Uint64} addr
 * @return {Hex}
 */
exports.addressKey = function(addr) {
  return addr.toString(16).toUpperCase();
};

/**
 * Returns the hex string representation of a Long.
 * @param {Uint64|Int64} l
 * @return {Hex}
 */
exports.hexify = function(l) {
  if (!(l instanceof Long)) {
    throw new Error('hexify only operates on Longs');
  }
  return padOcta(l.getHighBitsUnsigned().toString(16).toUpperCase() +
    l.getLowBitsUnsigned().toString(16).toUpperCase());
};

/**
 * Converts a hexadecimal to a decimal number string.
 * @param {Hex} hex
 * @param {string}
 */
exports.decify = (function() {
  var h2n = {
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'A': 10,
    'B': 11,
    'C': 12,
    'D': 13,
    'E': 14,
    'F': 15,
  };

  return function(hex) {
    var length = hex.length;
    return hex
      .split('')
      .map(function(h, i) {
        return new Long(h2n[h] * Math.pow(16, length - i - 1));
      })
      .reduce(function(sum, n) {
        return n.add(sum);
      })
      .toString(10);
  };
})();

/**
 * Converts a decimal string to a hexadecimal string.
 * @function
 * @param {string} deci
 * @param {Hex}
 */
exports.toHex = (function() {
  var n2h = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
  ];

  return function(deci) {
    var digits = [];
    var q = new Big(deci);
    var r;

    while (q.gte(1)) {
      r = q.mod(16);
      digits.unshift(r.toString());
      q = q.div(16).round(0, 0);
    }

    return digits.map(function(d) {
      return n2h[d];
    }).join('') || '0';
  };
})();
