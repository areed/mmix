//Testing pop requires a little more setup than a single state diff.
var expect = require('chai').expect;
var MMIX = require('../MMIX');
var assemble = require('../assemble');

describe('subroutine linkage', function() {
  describe('a main program using 3 registers calling a subroutine with 1 input parameter and 3 output parameters', function() {
    it('should push and pop registers on and off the stack.', function() {
      var program = assemble([
        //the main routine's local state
        'SETL $0 0010',
        'SETL $1 0011',
        'SETL $2 0012',
        //the input parameter to the subroutine
        'SETL $4 0014',
        'PUSHJ 03 0001',
        //the subroutine
        'SETL $0 0020',
        'SETL $1 0021',
        'SETL $2 0022',
        'POP 03 0005'
        //back in the main routine
      ].map(function(i) {
        return i.split(' ');
      })).map(function(instruction) {
        return parseInt(instruction, 16);
      });

      var mmix = new MMIX(new Uint32Array(program));

      mmix.special.rO = '6000000000000000';
      mmix.special.rS = '6000000000000000';
      mmix.next();
      mmix.next();
      mmix.next();
      mmix.next();
      mmix.next();
      //we have entered the subroutine
      expect(mmix.special.rO).to.equal('6000000000000020');
      expect(mmix.general.$0).to.equal('0000000000000014');
      expect(mmix.general.$1).to.equal('0000000000000000');
      expect(mmix.general.$2).to.equal('0000000000000000');
      expect(mmix.general.$3).to.equal('0000000000000000');
      expect(mmix.general.$4).to.equal('0000000000000000');
      mmix.next();
      mmix.next();
      mmix.next();
      mmix.next();
      expect(mmix.special.rL).to.equal('0000000000000006');
      expect(mmix.special.rO).to.equal('6000000000000000');
      expect(mmix.special.rS).to.equal('6000000000000000');
      expect(mmix.general.$0).to.equal('0000000000000010');
      expect(mmix.general.$1).to.equal('0000000000000011');
      expect(mmix.general.$2).to.equal('0000000000000012');
      expect(mmix.general.$3).to.equal('0000000000000022');
      expect(mmix.general.$4).to.equal('0000000000000020');
      expect(mmix.general.$5).to.equal('0000000000000021');
      expect(mmix.general.$6).to.equal('0000000000000000');
      expect(mmix.isHalted()).to.equal(true);
    });
  });
});
