var expect = require('chai').expect;
var assemble = require('../assemble');

describe('Assembler', function() {
  it('should transform instructions into tetras.', function() {
    var instructions = [
      ['ADD', '$1', '$255', '$3'],
      ['ADDI', '$0', '$1', '10'],
      ['SETH', '$0', '0123'],
      ['INCMH', '$0', '4567'],
      ['INCML', '$0', '89AB'],
      ['INCL', '$0', 'CDEF'],
      ['STCO', 'AB', '$1', '$0'],
      ['STCOI', '77', '$1', '00'],
    ];
    var assembled = assemble(instructions);
    expect(assembled[0]).to.equal('2001FF03');
    expect(assembled[1]).to.equal('21000110');
    expect(assembled[2]).to.equal('E0000123');
    expect(assembled[3]).to.equal('E5004567');
    expect(assembled[4]).to.equal('E60089AB');
    expect(assembled[5]).to.equal('E700CDEF');
    expect(assembled[6]).to.equal('B4AB0100');
    expect(assembled[7]).to.equal('B5770100');
  });
});
