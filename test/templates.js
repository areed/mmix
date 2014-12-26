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

exports.wyde = function(op, tests) {
  describe(op, function() {
    var mmix = new MMIX(new Memory());

    tests.forEach(function(t) {
      var YZ = t[0];
      var $X = t[1]; //the value in $X after the operation

      describe('YZ == ' + YZ, function() {
        it([op, '($1, ', YZ, '): $1 == ', $X].join(''), function() {
          mmix[op]('$1', YZ);
          expect(mmix.registers.$1).to.equal($X);
        });
      });
    });
  });
};

//immediate wyde constants that transform rather than override the value in $X
exports.wydeX = function(op, tests) {
  describe(op, function() {
    var mmix = new MMIX(new Memory());

    tests.forEach(function(t) {
      var $X = t[0];
      var YZ = t[1];
      var answer = t[2];

      describe(['$1 ==', $X, '&& YZ ==', YZ].join(' '), function() {
        before(function() {
          mmix.registers.$1 = $X;
        });

        it([op, '($1, ', YZ, '): $1 == ', answer].join(''), function() {
          mmix[op]('$1', YZ);
          expect(mmix.registers.$1).to.equal(answer);
        });
      });
    });
  });
};