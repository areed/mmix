var expect = require('chai').expect;
var Long = require('long');
var nth = require('highlandx/nth');
var Memory = require('../memory');

describe('Memory', function() {
  describe('effectiveAddress', function() {
    var tests = [
      //byteWidth, input address, effective
      [1, '1', '1'],
      [2, '1', '0'],
      [4, '1', '0'],
      [8, '1', '0'],
      [1, '2', '2'],
      [2, '2', '2'],
      [4, '2', '0'],
      [8, '2', '0'],
      [1, 'D', 'D'],
      [2, 'D', 'C'],
      [4, 'D', 'C'],
      [8, 'D', '8']
    ];
    var width = nth(0);
    var real = nth(1);
    var answer = nth(2);

    tests.forEach(function(t) {
      var addr = Long.fromString(real(t), 16);
      describe(['effectiveAddress(', width(t), ', "', real(t), '")'].join(''), function() {
        it(['=>', answer(t)].join(' '), function() {
          var effective = Memory.effectiveAddress(width(t), addr);
          expect(effective.toString(16).toUpperCase()).to.equal(answer(t));
        });
      });
    });
  });
});
