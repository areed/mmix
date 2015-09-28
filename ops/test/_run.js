var lodash = require('lodash');
var expect = require('chai').expect;
var MMIX = require('../../MMIX');
var _ = require('../../utils');
var disassemble = require('../../disassemble');

test(require('./arithmetic'));
//test(require('./bitwise'));
//test(require('./bytewise'));
//test(require('./branch'));
//test(require('./compare'));
//test(require('./conditionals'));
//test(require('./immediate'));
//test(require('./interrupts'));
test(require('./load'));
//test(require('./shift'));
test(require('./store'));
//test(require('./swym'));

function test(module) {
  lodash.each(lodash.keys(module), function(key) {
    describe(key, function() {
      differ(module[key]);
    });
  });
}

function differ(tests) {
  tests.forEach(function(t) {
    var instruction = t[0];
    var state = t[1]; //actually a diff applied to the machine to bring it up to the desired state
    var diff = t[2];
    var pretty = disassemble(instruction);
    var machine = null;

    describe('State is: ' + JSON.stringify(state), function() {
      before(function() {
        machine = new MMIX();
        var effects = _.diffEffects(state, machine);
        _.applyDiff(effects, machine);
        _.applyDiff(state, machine);
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
}
