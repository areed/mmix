var expect = require('chai').expect;
var nth = require('highlandx/nth');
var MMIX = require('../');

describe('LDB', function() {
  var mmix = new MMIX();
  var tests = [
    //register, Y operand, Z operand, M8 address, octabyte data, correct register value
    ['$1', '00', '02', '0000000000000002', '0123456789ABCDEF', '0000000000000045'],
    ['$1', '00', '05', '0000000000000005', '0123456789ABCDEF', 'FFFFFFFFFFFFFFAB'],
  ];
  var X = nth(0);
  var Y = nth(1);
  var Z = nth(2);
  var address = nth(3);
  var data = nth(4);
  var answer = nth(5);

  tests.forEach(function(t) {
    describe(['Memory8[', address(t), '] = ', data(t)].join(''), function() {
      before(function() {
        mmix.memory.setOcta(data(t), address(t));
      });

      describe(['LDB', X(t), Y(t), Z(t)].join(' '), function() {
        it(['should set register', X(t), 'to', answer(t)].join(' '), function() {
          mmix.LDB(X(t), Y(t), Z(t));
          expect(mmix.registers[X(t)]).to.equal(answer(t));
        });
      });
    });
  });
});

describe('LDW', function() {
  var mmix = new MMIX();
  var tests = [
    //register, Y operand, Z operand, M8 address, data, correct register value
    ['$1', '00', '02', '0000000000000002', '0123456789ABCDEF', '0000000000004567'],
    ['$1', '00', '05', '0000000000000005', '0123456789ABCDEF', 'FFFFFFFFFFFF89AB'],
  ];
  var X = nth(0);
  var Y = nth(1);
  var Z = nth(2);
  var address = nth(3);
  var data = nth(4);
  var answer = nth(5);

  tests.forEach(function(t) {
    describe(['Memory8[', address(t), '] = ', data(t)].join(''), function() {
      before(function() {
        mmix.memory.setOcta(data(t), address(t));
      });

      describe(['LDW', X(t), Y(t), Z(t)].join(' '), function() {
        it(['should set register', X(t), 'to', answer(t)].join(' '), function() {
          mmix.LDW(X(t), Y(t), Z(t));
          expect(mmix.registers[X(t)]).to.equal(answer(t));
        });
      });
    });
  });
});
