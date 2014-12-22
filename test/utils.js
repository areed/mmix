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
        it(['(', width, input, ') =>', answer].join(' '), function() {
          expect(effective(width, input).toString()).to.equal(answer.toString());
        });
      });
    });
  });
});
