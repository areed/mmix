var expect = require('chai').expect;
var MMIX = require('../');
var Memory = require('../memory');
var assemble = require('../assemble');

describe('Programs', function() {
  var memory = new Memory();
  var mmix = new MMIX(memory);
  var instructions = [
    ['SETH', '$0', '0123'],
    ['INCMH', '$0', '4567'],
    ['INCML', '$0', '89AB'],
    ['INCL', '$0', 'CDEF'],
  ];

  describe('loadProgram', function() {
    it('should load the program into memory starting at the returned address.', function() {
      var assembled = assemble(instructions);
      var start = mmix.loadProgram(assembled);
      var key = Memory.addressKey(start);

      expect(memory.store[key]).to.equal(assembled[0].substring(0,2));
      key = Memory.addressKey(start.plus(15));
      expect(memory.store[key]).to.equal(assembled[3].substring(6,8));
    });
  });

  describe('run', function() {
    var assembled = assemble(instructions);
    var start = mmix.loadProgram(assembled);

    it('should run a program at the given memory address.', function() {
      var s = mmix.run(start);
      s.each(function(x) {
      });
      expect(mmix.registers.$0).to.equal('0123456789ABCDEF');
    });
  });
});
