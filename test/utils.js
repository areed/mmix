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
});
