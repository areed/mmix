var expect = require('chai').expect;
var Big = require('big.js');

var utils = require('../utils');

describe('Utils', function() {
  describe('effectiveAddress', function() {
    var effective = utils.effectiveAddress;
    [
      //input, byte effective, wyde effective, tetra effective, octa effective
      [1000, 1000, 1000, 1000, 1000],
      [1001, 1001, 1000, 1000, 1000],
      [1002, 1002, 1002, 1000, 1000],
      [1003, 1003, 1002, 1000, 1000],
      [1004, 1004, 1004, 1004, 1000],
      [1005, 1005, 1004, 1004, 1000],
      [1006, 1006, 1006, 1004, 1000],
      [1007, 1007, 1006, 1004, 1000],
      [1008, 1008, 1008, 1008, 1008],
    ].forEach(function(t) {
      var input = Big(t[0]);
 
      [
        [1, Big(t[1])],
        [2, Big(t[2])],
        [4, Big(t[3])],
        [8, Big(t[4])],
      ].forEach(function(r) {
        var width = r[0];
        var answer = r[1];
        it(['(', width, input, ') ==', answer].join(' '), function() {
          expect(effective(width, input).toString()).to.equal(answer.toString());
        });
      });
    });
  });

  //quotient, remainder
  var qrTests = [
    //n, divisor, quotient, remainder
    [0, 1, 0, 0],
    [1, 1, 1, 0],
    [1, 2, 0, 1],
    [2, 1, 2, 0],
    [3, 2, 1, 1],
    [-1, 1, -1, 0],
    [-1, 2, -1, 1],
    [-2, 1, -2, 0],
    [-3, 2, -2, 1],
    [0, -1, 0, 0],
    [1, -1, -1, 0],
    [1, -2, 0, 1],
    [2, -1, -2, 0],
    [3, -2, -1, 1],
  ];

  describe('quotient', function() {
    qrTests.forEach(function(t) {
      var n = Big(t[0]);
      var divisor = Big(t[1]);
      var quotient = Big(t[2]);
      var remainder = Big(t[3]);

      it(['(', divisor, n, ') ==', quotient].join(' '), function() {
        expect(utils.quotient(divisor, n).toString()).to.equal(quotient.toString());
      });
    });
  });

  describe('remainder', function() {
    qrTests.forEach(function(t) {
      var n = Big(t[0]);
      var divisor = Big(t[1]);
      var quotient = Big(t[2]);
      var remainder = Big(t[3]);

      it(['(', divisor, n, ') ==', remainder].join(' '), function() {
        expect(utils.remainder(divisor, n).toString()).to.equal(remainder.toString());
        //n = qd + r
        expect(quotient.times(divisor).plus(remainder).toString()).to.equal(n.toString());
      });
    });
  });
});
