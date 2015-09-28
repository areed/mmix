var expect = require('chai').expect;
var MMIX = require('../mmix');
var _ = require('../utils');
var disassemble = require('../disassemble');

exports.differ = function(tests) {
  tests.forEach(function(t) {
    var instruction = t[0];
    var state = t[1]; //actually a diff applied to the machine to bring it up to the desired state
    var diff = t[2];
    var pretty = disassemble(instruction);
    var machine = null;

    describe('State is: ' + JSON.stringify(state), function() {
      before(function() {
        machine = _.applyDiff(state, new MMIX());
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
