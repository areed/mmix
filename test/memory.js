var expect = require('chai').expect;
var Memory = require('../memory');

describe.skip('Memory', function() {
  var memory = null;

  before(function() {
    memory = new Memory(2, 40, 6); //use defaults for stack and kernel
  });

  it('should construct a memory object with a text segment.', function() {
    expect(memory.text).to.be.an.instanceof(Uint8Array);
    expect(memory.text).to.have.property('length', 2);
  });

  it('should have a data segment.', function() {
    expect(memory.data).to.be.an.instanceof(Uint8Array);
    expect(memory.data).to.have.property('length', 40);
  });

  it('should have a pool segment.', function() {
    expect(memory.pool).to.be.an.instanceof(Uint8Array);
    expect(memory.pool).to.have.property('length', 6);
  });

  it('should have a stack segment.', function() {
    expect(memory.stack).to.be.an.instanceof(Uint8Array);
    expect(memory.stack).to.have.property('length', 512);
  });

  it('should have a kernel space.', function() {
    expect(memory.kernel).to.be.an.instanceof(Uint8Array);
    expect(memory.kernel).to.have.property('length', 0);
  });

  it('should provide accessors to get and set a byte.', function() {
    memory.setByte(0, '0000000000000000');
    expect(memory.getByte('0000000000000000')).to.equal(0);
    memory.setByte(200, '0000000000000000');
    expect(memory.getByte('0000000000000000')).to.equal(200);
    memory.setByte(99, '2000000000000002');
    expect(memory.getByte('2000000000000002')).to.equal(99);
  });
});
