var expect = require('chai').expect;
var MMIX = require('../MMIX');

describe('MMIX programs', function() {
  it('should step through the program.', function() {
    var program = new Uint32Array([
      parseInt('E0017000', 16),
      parseInt('E00200A0', 16),
      parseInt('20000102', 16)
    ]);
    var mmix = new MMIX(program);

    expect(mmix.next()).to.deep.equal({
      '$1': '7000000000000000',
      'rL': '0000000000000002',
      '@': '0000000000000004',
    });
    expect(mmix.next()).to.deep.equal({
      '$2': '00A0000000000000',
      'rL': '0000000000000003',
      '@': '0000000000000008',
    });
    expect(mmix.next()).to.deep.equal({
      '$0': '70A0000000000000',
      '@': '000000000000000C',
    });
    expect(mmix.isHalted()).to.equal(true);
    mmix.prev();
    expect(mmix.next()).to.deep.equal({
      '$0': '70A0000000000000',
      '@': '000000000000000C',
    });
  });
});
