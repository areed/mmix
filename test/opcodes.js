var expect = require('chai').expect;
var opcodes = require('../opcodes');

describe.skip('Opcodes', function() {
  it('opcodes should be a map from opnames to opcodes.', function() {
    expect(opcodes.opcodes.FMUL).to.equal(16);
    expect(opcodes.opcodes.ADD).to.equal(32);
    expect(opcodes.opcodes.CMP).to.equal(48);
    expect(opcodes.opcodes.BN).to.equal(64);
    expect(opcodes.opcodes.PBN).to.equal(80);
    expect(opcodes.opcodes.CSN).to.equal(96);
    expect(opcodes.opcodes.ZSN).to.equal(112);
    expect(opcodes.opcodes.LDB).to.equal(128);
    expect(opcodes.opcodes.LDSF).to.equal(144);
    expect(opcodes.opcodes.STB).to.equal(160);
    expect(opcodes.opcodes.STSF).to.equal(176);
    expect(opcodes.opcodes.OR).to.equal(192);
    expect(opcodes.opcodes.BDIF).to.equal(208);
    expect(opcodes.opcodes.SETH).to.equal(224);
    expect(opcodes.opcodes.JMP).to.equal(240);
    expect(opcodes.opcodes.TRIP).to.equal(255);
  });

  it('formats should be a map from opnames to signatures.', function() {
    expect(opcodes.formats.STB).to.deep.equal([0, 0, 0]);
    expect(opcodes.formats.ADDI).to.deep.equal([0, 0, 1]);
  });

  it('opnames should be a map from bytes to opnames', function() {
    expect(opcodes.opnames.FF).to.equal('TRIP');
  });

  it('ops should return the function that performs the operation.', function() {
    expect(opcodes.ops[0]).to.have.property('name', 'TRAP');
    expect(opcodes.ops[255]).to.have.property('name', 'TRIP');
  });
});
