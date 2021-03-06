/** @module assemble */
var _ = require('./utils');
var ops = require('./ops');

function assemble(instruction) {
  var opname = instruction[0];
  var args = instruction.slice(1);
  var format = ops.formats[opname];
  var opcode = ops.opcodes[opname];

  return _.hexifyByte(opcode) + args.map(function(arg, index) {
    switch (format[index]) {
    case -1:
      return '00';
    case 0:
      return _.registerToHex(arg);
    case 1:
      //fallthrough
    case 2:
      //fallthrough
    case 3:
      return arg;
    }
  }).join('');
}

/**
 * @alias module:assemble
 * @param {Array} instructions
 * @return {Hex[]}
 */
module.exports = function(instructions) {
  return instructions.map(assemble);
};
