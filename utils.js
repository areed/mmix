var Big = require('big.js');

/**
 * @param {ByteWidth} byteWidth
 * @param {Uint} addr
 * @return {Uint}
 */
exports.effectiveAddress = function(byteWidth, addr) {
  return addr.minus(addr.mod(byteWidth));
};
