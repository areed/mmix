var Long = require('long');

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
