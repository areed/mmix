var Big = require('big.js');
var hexa = require('hexa');
var _ = require('highland');

var twoToThe64th = Big(2).pow(64);

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
  return hexa.signExtend(64, 8, hex);
};

exports.signExtend16To64 = function(hex) {
  return hexa.signExtend(64, 16, hex);
};

exports.signExtend32To64 = function(hex) {
  return hexa.signExtend(64, 32, hex);
};

/**
 * Returns the hex constant byte for a general purpose register.
 * @param {string} $X - e.g. $0 or $255
 * @return {Hex}
 */
exports.registerToHex = function($X) {
  return hexifyByte($X.slice(1));
};
