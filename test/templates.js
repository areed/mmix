var expect = require('chai').expect;
var Memory = require('../memory');
var MMIX = require('../mmix');
var _ = require('../utils');
var disassemble = require('../disassemble');

exports.diff = function(tests) {
  tests.forEach(function(t) {
    var state = t[0];
    var tetra = t[1];
    var diff = t[2];
    var machine = null;

    describe('State is: ' + JSON.stringify(state), function() {
      before(function() {
        machine = _.applyDiff(state, new MMIX(new Memory()));
      });

      it(tetra + ' should return diff: ' + JSON.stringify(diff), function() {
        expect(_.execute(tetra, machine)).to.deep.equal(diff);
      });
    });
  });
};

exports.differ = function(tests) {
  tests.forEach(function(t) {
    var instruction = t[0];
    var state = t[1]; //actually a diff applied to the machine to bring it up to the desired state
    var diff = t[2];
    var pretty = disassemble(instruction);
    var machine = null;

    describe('State is: ' + JSON.stringify(state), function() {
      before(function() {
        machine = _.applyDiff(state, new MMIX(new Memory()));
      });
      
      describe(instruction + ' (' + pretty[0] + ' ' + pretty.slice(1).join(', ') + ')', function() {
        it('should return diff: ' + JSON.stringify(diff), function() {
          var out = _.execute(instruction, machine);
          for (var d in diff) {
            expect(out).to.have.property(d, diff[d]);
          }
          for (var o in out) {
            expect(out).to.have.property(o, diff[o]);
          }
          expect(out).to.deep.equal(diff);
        });
      });
    });
  });
};

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
