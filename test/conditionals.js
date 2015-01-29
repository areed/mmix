var expect = require('chai').expect;

var Memory = require('../memory');

return;

describe('Conditional Instructions', function() {
  var mmix = new MMIX(new Memory());
  var zeros = '0000000000000000';
  var ones = '1111111111111111';
  var twos = '2222222222222222';

  var tests = [
    //$Y, isNeg, isZero, isPositive, isOdd
    ['0000000000000000', false, true, false, false],
    ['FFFFFFFFFFFFFFFF', true, false, false, true],
    ['0000000000000001', false, false, true, true],
    ['FFFFFFFFFFFFFFFE', true, false, false, false],
    ['0000000000000002', false, false, true, false],
  ];
  tests.forEach(function(t) {
    var Y = t[0];
    var isNeg = t[1];
    var isZero = t[2];
    var isPos = t[3];
    var isOdd = t[4];

    describe(['$1 ==', ones, '&& $2 ==', Y, '&& $3 ==', twos].join(' '), function() {
      beforeEach(function() {
        mmix.registers.$1 = ones;
        mmix.registers.$2 = Y;
        mmix.registers.$3 = twos;
      });

      it('CSN($1, $2, $3): $1 == ' + (isNeg ? twos : ones), function() {
        mmix.CSN('$1', '$2', '$3');
        expect(mmix.registers.$1).to.equal(isNeg ? twos : ones);
      });

      it('CSZ($1, $2, $3): $1 == ' + (isZero ? twos : ones), function() {
        mmix.CSZ('$1', '$2', '$3');
        expect(mmix.registers.$1).to.equal(isZero ? twos : ones);
      });

      it('CSP($1, $2, $3): $1 == ' + (isPos ? twos : ones), function() {
        mmix.CSP('$1', '$2', '$3');
        expect(mmix.registers.$1).to.equal(isPos ? twos : ones);
      });

      it('CSOD($1, $2, $3): $1 == ' + (isOdd ? twos : ones), function() {
        mmix.CSOD('$1', '$2', '$3');
        expect(mmix.registers.$1).to.equal(isOdd ? twos : ones);
      });

      it('CSNN($1, $2, $3): $1 == ' + (isNeg ? ones : twos), function() {
        mmix.CSNN('$1', '$2', '$3');
        expect(mmix.registers.$1).to.equal(isNeg ? ones : twos);
      });

      it('CSNZ($1, $2, $3): $1 == ' + (isZero ? ones : twos), function() {
        mmix.CSNZ('$1', '$2', '$3');
        expect(mmix.registers.$1).to.equal(isZero ? ones : twos);
      });

      it('CSNP($1, $2, $3): $1 == ' + (isPos ? ones : twos), function() {
        mmix.CSNP('$1', '$2', '$3');
        expect(mmix.registers.$1).to.equal(isPos ? ones : twos);
      });

      it('CSEV($1, $2, $3): $1 == ' + (isOdd ? ones : twos), function() {
        mmix.CSEV('$1', '$2', '$3');
        expect(mmix.registers.$1).to.equal(isOdd ? ones : twos);
      });

      it('ZSN($1, $2, $3): $1 == ' + (isNeg ? twos : zeros), function() {
        mmix.ZSN('$1', '$2', '$3');
        expect(mmix.registers.$1).to.equal(isNeg ? twos : zeros);
      });

      it('ZSZ($1, $2, $3): $1 == ' + (isZero ? twos : zeros), function() {
        mmix.ZSZ('$1', '$2', '$3');
        expect(mmix.registers.$1).to.equal(isZero ? twos : zeros);
      });

      it('ZSP($1, $2, $3): $1 == ' + (isPos ? twos : zeros), function() {
        mmix.ZSP('$1', '$2', '$3');
        expect(mmix.registers.$1).to.equal(isPos ? twos : zeros);
      });

      it('ZSOD($1, $2, $3): $1 == ' + (isOdd ? twos : zeros), function() {
        mmix.ZSOD('$1', '$2', '$3');
        expect(mmix.registers.$1).to.equal(isOdd ? twos : zeros);
      });

      it('ZSNN($1, $2, $3): $1 == ' + (isNeg ? zeros : twos), function() {
        mmix.ZSNN('$1', '$2', '$3');
        expect(mmix.registers.$1).to.equal(isNeg ? zeros : twos);
      });

      it('ZSNZ($1, $2, $3): $1 == ' + (isZero ? zeros : twos), function() {
        mmix.ZSNZ('$1', '$2', '$3');
        expect(mmix.registers.$1).to.equal(isZero ? zeros : twos);
      });

      it('ZSNP($1, $2, $3): $1 == ' + (isPos ? zeros : twos), function() {
        mmix.ZSNP('$1', '$2', '$3');
        expect(mmix.registers.$1).to.equal(isPos ? zeros : twos);
      });

      it('ZSEV($1, $2, $3): $1 == ' + (isOdd ? zeros : twos), function() {
        mmix.ZSEV('$1', '$2', '$3');
        expect(mmix.registers.$1).to.equal(isOdd ? zeros : twos);
      });
    });
  });
});
