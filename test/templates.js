var expect = require('chai').expect;
var Memory = require('../memory');
var MMIX = require('../');

exports.$X$Y$Z = function(op, tests) {
  describe(op, function() {
    var mmix = new MMIX(new Memory());

    tests.forEach(function(t) {
      var Y = t[0];
      var Z = t[1];
      var X = t[2]; //the value in $X after the operation

      describe(['$2 ==', Y, '&& $3 ==', Z].join(' '), function() {
        before(function() {
          mmix.registers.$2 = Y;
          mmix.registers.$3 = Z;
        });

        it([op, '($1, $2, $3): $1 ==', X].join(' '), function() {
          mmix[op]('$1', '$2', '$3');
          expect(mmix.registers.$1).to.equal(X);
        });
      });
    });
  });
};
