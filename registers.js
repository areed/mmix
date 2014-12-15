/**
 * @readonly
 * @enum {number}
 */
var Registers = {
  //General Purpose
  '$0': 0,
  '$1': 1,
  '$2': 2,
  '$3': 3,
  '$4': 4,
  '$5': 5,
  '$6': 6,
  '$7': 7,
  '$8': 8,
  //...
  '$255': 255,
  //Special Purpose
  'rA': 256,
  'rB': 257,
  //...
  'rZ': 281,
  'rBB': 282,
  'rTT': 283,
  'rWW': 284,
  'rXX': 285,
  'rYY': 286,
  'rZZ': 287
};

module.exports = Registers;
