var MMIX = require('../MMIX');

describe.only('MMIX programs', function() {
  it('should run.', function() {
    var program = new Uint32Array(3);

    program[0] = parseInt('E0017000', 16);
    program[1] = parseInt('E00200A0', 16);
    program[2] = parseInt('20000102', 16);
    var mmix = new MMIX(program);
    console.log(mmix.next());
    console.log(mmix.next());
    console.log(mmix.next());
    console.log(mmix.next());
  });
});
