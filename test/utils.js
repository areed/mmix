var expect = require('chai').expect;
var nth = require('highlandx/nth');
var utils = require('../utils');
var Long = require('long');

describe('Utils', function() {
  var intTests = [
    //hex, signed, unsigned
    ['0', new Long(0, 0), new Long(0, 0, true)],
    ['1', new Long(1, 0), new Long(1, 0, true)],
    ['FFFFFFFF', new Long(-1, 0), new Long(-1, 0, true)],
    ['FFFFFFFFFFFFFFFF', new Long(-1, -1), new Long(-1, -1, true)]
  ];
  var hex = nth(0);
  var signed = nth(1);
  var unsigned = nth(2);

  intTests.forEach(function(t) {
    describe(['int64("', hex(t), '")'].join(''), function() {
      it(['=> ', signed(t).toString(16)].join(''), function() {
        var i = utils.int64(hex(t));
        expect(i.compare(signed(t))).to.equal(0);
      });
    });
  });

  intTests.forEach(function(t) {
    describe(['uint64("', hex(t), '")'].join(''), function() {
      it(['=> ', unsigned(t).toString(16)].join(''), function() {
        var u = utils.uint64(hex(t));
        expect(u.compare(unsigned(t))).to.equal(0);
      });
    });
  });

  describe('signExtend', function() {
    var tests = [
      //byte width, in, out
      [1, 'FF', 'FFFFFFFFFFFFFFFF'],
      [1, '60', '0000000000000060'],
      [2, 'FFFF', 'FFFFFFFFFFFFFFFF'],
      [2, '7FFF', '0000000000007FFF'],
      [4, '80000000', 'FFFFFFFF80000000'],
      [4, '76543210', '0000000076543210'],
      [8, 'FFFFFFFFFFFFFFFF', 'FFFFFFFFFFFFFFFF'],
      [8, '0000000000000000', '0000000000000000'],
    ];
    var width = nth(0);
    var input = nth(1);
    var output = nth(2);

    tests.forEach(function(t) {
      describe(['(', width(t), ', ', input(t), ')'].join(''), function() {
        it(['=>', output(t)].join(' '), function() {
          var actual = utils.signExtend(width(t), input(t));
          expect(actual).to.equal(output(t));
        });
      });
    });
  });

  (function() {
    var tests = [
      //hex, decimal
      ['0', '0'],
      ['A', '10'],
      ['FF', '255'],
      ['2B1', '689'],
      ['830C', '33548'],
    ];
    var hexa = nth(0);
    var deci = nth(1);

    describe('decify', function() {
      tests.forEach(function(t) {
        it([hexa(t), '=>', deci(t)].join(' '), function() {
          var d = utils.decify(hexa(t));
          expect(d).to.equal(deci(t));
        });
      });
    });

    describe('toHex', function() {
      tests.forEach(function(t) {
        it([deci(t), '=>', hexa(t)].join(' '), function() {
          var h = utils.toHex(deci(t));
          expect(h).to.equal(hexa(t));
        });
      });
    });
  })();
});
