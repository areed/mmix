var expect = require('chai').expect;
var nth = require('highlandx/nth');
var MMIX = require('../');

describe('LDB', function() {
  var mmix = new MMIX();
  var tests = [
    //register, operand, operand, address, data
    ['$1', 'FF', '01', '0000000000000100', '0F'],
    ['$0', '00', '00', '0000000000000000', '7F'],
  ];
  var X = nth(0);
  var Y = nth(1);
  var Z = nth(2);
  var address = nth(3);
  var data = nth(4);

  tests.forEach(function(t) {
    describe('given memory address 0x' + address(t) + ' holds the byte ' + data(t), function() {
      before(function() {
        mmix.memory[address(t)] = data(t);
      });

      describe(['LDB', X(t), Y(t), Z(t)].join(' '), function() {
        it(['should set register', X(t), 'to', data(t)].join(' '), function() {
          mmix.LDB(X(t), Y(t), Z(t));
          expect(mmix.registers[X(t)]).to.equal(data(t));
        });
      });
    });
  });
});
