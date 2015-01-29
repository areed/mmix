var expect = require('chai').expect;
var disassemble = require('../disassemble');

describe.skip('Disassembler', function() {
  var instructions = [
    ['2001FF03', ['ADD', '$1', '$255', '$3']],
    ['21000110', ['ADDI', '$0', '$1', '10']],
    ['E0000123', ['SETH', '$0', '0123']],
    ['E5004567', ['INCMH', '$0', '4567']],
    ['E60089AB', ['INCML', '$0', '89AB']],
    ['E700CDEF', ['INCL', '$0', 'CDEF']],
  ];

  instructions.forEach(function(t) {
    var tetra = t[0];
    var out = t[1];

    it('should convert ' + tetra + ' to ' + JSON.stringify(out), function() {
      expect(disassemble(tetra)).to.deep.equal(out);
    });
  });
});
