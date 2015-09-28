var ops = require('./ops');

/**
 * Returns the opname and arguments from a tetra.
 * @param {Hex} tetra
 * @param {Array}
 */
function disassemble(instruction) {
  var opname = ops.opnames[instruction.substring(0,2)];
  var format = ops.formats[opname];
  var args = [];
  var p = 2;

  format.forEach(function(f, i) {
    switch (f) {
    case -1:
      p += 2;
      return;
    case 0:
      var X = parseInt(instruction.substring(p, p + 2), 16);
      args.push('$' + X);
      p += 2;
      return;
    case 1:
      //fallthrough
    case 2:
      //fallthrough
    case 3:
      args.push(instruction.substring(p, p + (2 * f)));
      p += 2 * f;
    }
  });

  return [opname].concat(args);
}

module.exports = disassemble;
