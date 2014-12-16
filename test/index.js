var expect = require('chai').expect;
var nth = require('highlandx/nth');
var MMIX = require('../');
var Memory = require('../memory');

describe('Load From Memory Operations', function() {
  var memory = new Memory();
  var mmix = new MMIX(memory);
  var tests = [
    //register, Y operand, Z operand, address, octabyte at the memory address
    ['$1', '00', '02', '0000000000000002', '0123456789ABCDEF', '0000000000000045'],
    ['$1', '00', '05', '0000000000000005', '0123456789ABCDEF', 'FFFFFFFFFFFFFFAB'],
  ];
  var X = nth(0);
  var Y = nth(1);
  var Z = nth(2);
  var address = nth(3);
  var data = nth(4);

  function test(op, answers) {
    describe(op, function() {
      tests.forEach(function(t, i) {
        describe(['Memory8[', address(t), '] = ', data(t)].join(''), function() {
          before(function() {
            memory.setOcta(data(t), address(t));
          });

          describe([op, X(t), Y(t), Z(t)].join(' '), function() {
            it(['should set register', X(t), 'to', answers[i]].join(' '), function() {
              mmix[op](X(t), Y(t), Z(t));
              expect(mmix.registers[X(t)]).to.equal(answers[i]);
            });
          });
        });
      });
    });
  }

  test('LDB', [
    '0000000000000045',
    'FFFFFFFFFFFFFFAB'
  ]);

  test('LDW', [
    '0000000000004567',
    'FFFFFFFFFFFF89AB',
  ]);

  test('LDT', [
    '0000000001234567',
    'FFFFFFFF89ABCDEF',
  ]);

  test('LDO', [
    '0123456789ABCDEF',
    '0123456789ABCDEF',
  ]);

  test('LDBU', [
    '0000000000000045',
    '00000000000000AB',
  ]);

  test('LDWU', [
    '0000000000004567',
    '00000000000089AB',
  ]);

  test('LDTU', [
    '0000000001234567',
    '0000000089ABCDEF',
  ]);

  test('LDOU', [
    '0123456789ABCDEF',
    '0123456789ABCDEF',
  ]);

  test('LDTH', [
    '0123456700000000',
    '89ABCDEF00000000',
  ]);
});

describe('Load Address operation', function() {
  var mmix = new MMIX();
  var tests = [
    ['$1', 'F4', '9C', '0000000000000190']
  ];

  tests.forEach(function(t) {
    describe(['LDA', t[0], t[1], t[2]].join(' '), function() {
      it(['should set', t[0], ' to ', t[3]].join(' '), function() {
        mmix.LDA(t[0], t[1], t[2]);
        expect(mmix.registers[t[0]]).to.equal(t[3]);
      });
    });
  });
});
