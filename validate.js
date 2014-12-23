var _ = require('highland');

/* Precondtion Validators */
var isRegister = function($X) {
  return typeof registers[$X] !== 'undefined';
};
var arg0IsRegister = validator('The first argument is not a register in MMIX.', isRegister);
var arg1IsRegister = validator('The second argument is not a register in MMIX.', function(x, $Y) {
  return isRegister($Y);
});
var arg2IsRegister = validator('The third argument is not a register in MMIX.', function(x, y, $Z) {
  return isRegister($Z);
});

var validWidth = validator('Byte width must be 1, 2, 4, or 8.', function(w) {
  return w === 1 || w === 2 || w === 4 || w === 8;
});

var isByte = function(h) {
  return typeof h === 'string' && h.length === 2;
};
var arg0IsByte = validator('The first argument is not a single-byte hex string.', isByte);

/**
 * Verifies each argument is the name of a general register $1-$255.
 * @function
 * @param {function} fn
 * @return {function}
 */
exports.rgstrRgstrRgstr = _.ncurry(4, conditions(arg0IsRegister, arg1IsRegister, arg2IsRegister));

/**
 * Verifies that the arguments are a hex byte string and names or registers.
 * @function
 * @param {function} fn
 * @return {function}
 */
exports.byteRgstrRgstr = _.ncurry(4, conditions(arg0IsByte, arg1IsRegister, arg2IsRegister));
