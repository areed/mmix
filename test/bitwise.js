var expect = require('chai').expect;
var Memory = require('../memory');
var MMIX = require('../');

describe('Bitwise Operations', function() {
  var mmix = new MMIX(new Memory());

  describe('AND', function() {
    [
      ['0000000000000000', '0000000000000000', '0000000000000000'],
      ['0101010101010101', 'FFFFFFFFFFFFFFFF', '0101010101010101'],
      ['AAAAAAAAAAAAAAAA', '7777777777777777', '2222222222222222'],
    ].forEach(function(t) {
      var Y = t[0];
      var Z = t[1];
      var X = t[2];

      describe(['$2 ==', Y, '&& $3 ==', Z].join(' '), function() {
        before(function() {
          mmix.registers.$2 = Y;
          mmix.registers.$3 = Z;
        });

        it('AND($1, $2, $3): $1 == ' + X, function() {
          mmix.AND('$1', '$2', '$3');
          expect(mmix.registers.$1).to.equal(X);
        });
      });
    }); 
  });

  describe('OR', function() {
    [
      ['0101010101010101', '0000000000000000', '0101010101010101'],
      ['0101010101010101', 'FFFFFFFFFFFFFFFF', 'FFFFFFFFFFFFFFFF'],
      ['AAAAAAAAAAAAAAAA', '3333333333333333', 'BBBBBBBBBBBBBBBB'],
    ].forEach(function(t) {
      var Y = t[0];
      var Z = t[1];
      var X = t[2];

      describe(['$2 ==', Y, '&& $3 ==', Z].join(' '), function() {
        before(function() {
          mmix.registers.$2 = Y;
          mmix.registers.$3 = Z;
        });

        it('OR($1, $2, $3): $1 == ' + X, function() {
          mmix.OR('$1', '$2', '$3');
          expect(mmix.registers.$1).to.equal(X);
        });
      });
    }); 
  });

  describe('XOR', function() {
    [
      ['0101010101010101', '0000000000000000', '0101010101010101'],
      ['0101010101010101', 'FFFFFFFFFFFFFFFF', 'FEFEFEFEFEFEFEFE'],
      ['AAAAAAAAAAAAAAAA', '3333333333333333', '9999999999999999'],
    ].forEach(function(t) {
      var Y = t[0];
      var Z = t[1];
      var X = t[2];

      describe(['$2 ==', Y, '&& $3 ==', Z].join(' '), function() {
        before(function() {
          mmix.registers.$2 = Y;
          mmix.registers.$3 = Z;
        });

        it('XOR($1, $2, $3): $1 == ' + X, function() {
          mmix.XOR('$1', '$2', '$3');
          expect(mmix.registers.$1).to.equal(X);
        });
      });
    }); 
  });

  describe('ANDN', function() {
    [
      ['0101010101010101', '0000000000000000', '0101010101010101'],
      ['0101010101010101', 'FFFFFFFFFFFFFFFF', '0000000000000000'],
      ['AAAAAAAAAAAAAAAA', '3333333333333333', '8888888888888888'],
    ].forEach(function(t) {
      var Y = t[0];
      var Z = t[1];
      var X = t[2];

      describe(['$2 ==', Y, '&& $3 ==', Z].join(' '), function() {
        before(function() {
          mmix.registers.$2 = Y;
          mmix.registers.$3 = Z;
        });

        it('ANDN($1, $2, $3): $1 == ' + X, function() {
          mmix.ANDN('$1', '$2', '$3');
          expect(mmix.registers.$1).to.equal(X);
        });
      });
    }); 
  });

  describe('ORN', function() {
    [
      ['0101010101010101', '0000000000000000', 'FFFFFFFFFFFFFFFF'],
      ['0101010101010101', 'FFFFFFFFFFFFFFFF', '0101010101010101'],
      ['AAAAAAAAAAAAAAAA', '3333333333333333', 'EEEEEEEEEEEEEEEE'],
    ].forEach(function(t) {
      var Y = t[0];
      var Z = t[1];
      var X = t[2];

      describe(['$2 ==', Y, '&& $3 ==', Z].join(' '), function() {
        before(function() {
          mmix.registers.$2 = Y;
          mmix.registers.$3 = Z;
        });

        it('ORN($1, $2, $3): $1 == ' + X, function() {
          mmix.ORN('$1', '$2', '$3');
          expect(mmix.registers.$1).to.equal(X);
        });
      });
    }); 
  });

  describe('NAND', function() {
    [
      ['0000000000000000', '0000000000000000', 'FFFFFFFFFFFFFFFF'],
      ['0101010101010101', 'FFFFFFFFFFFFFFFF', 'FEFEFEFEFEFEFEFE'],
      ['AAAAAAAAAAAAAAAA', '7777777777777777', 'DDDDDDDDDDDDDDDD'],
    ].forEach(function(t) {
      var Y = t[0];
      var Z = t[1];
      var X = t[2];

      describe(['$2 ==', Y, '&& $3 ==', Z].join(' '), function() {
        before(function() {
          mmix.registers.$2 = Y;
          mmix.registers.$3 = Z;
        });

        it('NAND($1, $2, $3): $1 == ' + X, function() {
          mmix.NAND('$1', '$2', '$3');
          expect(mmix.registers.$1).to.equal(X);
        });
      });
    }); 
  });

  describe('NOR', function() {
    [
      ['0101010101010101', '0000000000000000', 'FEFEFEFEFEFEFEFE'],
      ['0101010101010101', 'FFFFFFFFFFFFFFFF', '0000000000000000'],
      ['AAAAAAAAAAAAAAAA', '3333333333333333', '4444444444444444'],
    ].forEach(function(t) {
      var Y = t[0];
      var Z = t[1];
      var X = t[2];

      describe(['$2 ==', Y, '&& $3 ==', Z].join(' '), function() {
        before(function() {
          mmix.registers.$2 = Y;
          mmix.registers.$3 = Z;
        });

        it('NOR($1, $2, $3): $1 == ' + X, function() {
          mmix.NOR('$1', '$2', '$3');
          expect(mmix.registers.$1).to.equal(X);
        });
      });
    }); 
  });

  describe('NXOR', function() {
    [
      ['0101010101010101', '0000000000000000', 'FEFEFEFEFEFEFEFE'],
      ['0101010101010101', 'FFFFFFFFFFFFFFFF', '0101010101010101'],
      ['AAAAAAAAAAAAAAAA', '3333333333333333', '6666666666666666'],
    ].forEach(function(t) {
      var Y = t[0];
      var Z = t[1];
      var X = t[2];

      describe(['$2 ==', Y, '&& $3 ==', Z].join(' '), function() {
        before(function() {
          mmix.registers.$2 = Y;
          mmix.registers.$3 = Z;
        });

        it('NXOR($1, $2, $3): $1 == ' + X, function() {
          mmix.NXOR('$1', '$2', '$3');
          expect(mmix.registers.$1).to.equal(X);
        });
      });
    }); 
  });

  describe('MUX', function() {
    [
      ['0000000000000000', 'FFFFFFFFFFFFFFFF', '8080808080808080', '7F7F7F7F7F7F7F7F'],
      ['0101010101010101', '0000000000000000', '0101010101010101', '0101010101010101'],
      ['0101010101010101', 'FFFFFFFFFFFFFFFF', 'FFFFFFFFFFFFFFFF', '0101010101010101'],
      ['AAAAAAAAAAAAAAAA', '3333333333333333', 'BBBBBBBBBBBBBBBB', 'AAAAAAAAAAAAAAAA'],
      ['2222222222222222', 'DDDDDDDDDDDDDDDD', 'FFFFFFFFFFFFFFFF', '2222222222222222'],
      ['2222222222222222', 'DDDDDDDDDDDDDDDD', '0000000000000000', 'DDDDDDDDDDDDDDDD'],
    ].forEach(function(t) {
      var Y = t[0];
      var Z = t[1];
      var rM = t[2];
      var X = t[3];

      describe(['$2 ==', Y, '&& $3 ==', Z, '&& $rM ==', rM].join(' '), function() {
        before(function() {
          mmix.registers.$2 = Y;
          mmix.registers.$3 = Z;
          mmix.registers.rM = rM;
        });

        it('MUX($1, $2, $3): $1 == ' + X, function() {
          mmix.MUX('$1', '$2', '$3');
          expect(mmix.registers.$1).to.equal(X);
        });
      });
    });
  });
});
