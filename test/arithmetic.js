var expect = require('chai').expect;
var Memory = require('../memory');
var MMIX = require('../');

describe('Arithmetic Operations', function() {
  var mmix = new MMIX(new Memory());

  describe('DIV', function() {
    [
      ['0000000000000001', '0000000000000001', '0000000000000001', '0000000000000000'],
      ['0000000000000002', 'FFFFFFFFFFFFFFFE', 'FFFFFFFFFFFFFFFF', '0000000000000000'],
      ['FFFFFFFFFFFFFFFD', '0000000000000002', 'FFFFFFFFFFFFFFFE', '0000000000000001'],
      ['FFFFFFFFFFFFFFFF', 'FFFFFFFFFFFFFFFF', '0000000000000001', '0000000000000000'],
      ['FFFFFFFFFFFFFFFF', '0000000000000002', 'FFFFFFFFFFFFFFFF', '0000000000000001'],
      ['0000000000000003', '0000000000000000', '0000000000000000', '0000000000000003'],
      ['9e3779b97f4a7c16', '9e3779b97f4a7c16', '0000000000000001', '0000000000000000'],
    ].forEach(function(t) {
      var Y = t[0];
      var Z = t[1];
      var X = t[2];
      var rR = t[3];

      describe(['$2 ==', Y, '&& $3 ==', Z].join(' '), function() {
        before(function() {
          mmix.registers.$2 = Y;
          mmix.registers.$3 = Z;
          mmix.DIV('$1', '$2', '$3');
        });
        it('$1  <- ' + X, function() {
          expect(mmix.registers.$1).to.equal(X);
        });

        it('$rR <- ' + rR, function() {
          expect(mmix.registers.rR).to.equal(rR);
        });
      });
    });
  });

  describe('DIVU', function() {
    [
      ['0000000000000001', '0000000000000001', '0000000000000001', '0000000000000001', '0000000000000001'],
      ['0000000000000002', 'FFFFFFFFFFFFFFFE', '8765432109ABCDEF', '8765432109ABCDF0', '0ECA864213579BE2'],
      ['FFFFFFFFFFFFFFFF', 'FFFFFFFFFFFFFFFF', '0000000000000000', '0000000000000001', '0000000000000000'],
      ['FFFFFFFFFFFFFFFF', '0000000000000002', '0000000011111111', '0000000011111111', 'FFFFFFFFFFFFFFFF'],
      ['0000000000000003', '0000000000000000', '0000000000000003', '0000000000000003', '0000000000000003'],
      ['9e3779b97f4a7c16', '9e3779b97f4a7c16', '9e3779b97f4a7c16', '9e3779b97f4a7c16', '9e3779b97f4a7c16'],
    ].forEach(function(t) {
      var Y = t[0];
      var Z = t[1];
      var rD = t[2];
      var X = t[3];
      var rR = t[4];

      describe(['$2 ==', Y, '&& $3 ==', Z, '&& $rD ==', rD].join(' '), function() {
        before(function() {
          mmix.registers.$2 = Y;
          mmix.registers.$3 = Z;
          mmix.registers.rD = rD;
          mmix.DIVU('$1', '$2', '$3');
        });

        it('$1  <- ' + X, function() {
          expect(mmix.registers.$1).to.equal(X);
        });

        it('$rR <- ' + Y, function() {
        });
      });
    });
  });

  describe('NEG', function() {
    var tests = [
      //Y, $Z, $X
      ['00', '0000000000000001', 'FFFFFFFFFFFFFFFF'],
      ['00', 'FFFFFFFFFFFFFFFF', '0000000000000001'],
      ['FF', '000000000000007F', '0000000000000080'],
      ['FF', '0000000000000100', 'FFFFFFFFFFFFFFFF'],
      ['FF', 'FFFFFFFFFFFFFFFF', '0000000000000100'],
    ];
    tests.forEach(function(t) {
      var Y = t[0];
      var Z = t[1];
      var X = t[2];

      describe(['Y ==', Y, '$$ $3', Z].join(' '), function() {
        before(function() {
          mmix.registers.$3 = Z;
          mmix.NEG('$1', Y, '$3');
        });

        it('$1 <- ' + X, function() {
          expect(mmix.registers.$1).to.equal(X);
        });
      });
    });
  });

  describe('NEGU', function() {
    var tests = [
      //Y, $Z, $X
      ['00', '0000000000000001', 'FFFFFFFFFFFFFFFF'],
      ['00', 'FFFFFFFFFFFFFFFF', '0000000000000001'],
      ['FF', '000000000000007F', '0000000000000080'],
      ['FF', '0000000000000100', 'FFFFFFFFFFFFFFFF'],
      ['FF', 'FFFFFFFFFFFFFFFF', '0000000000000100'],
    ];
    tests.forEach(function(t) {
      var Y = t[0];
      var Z = t[1];
      var X = t[2];

      describe(['Y ==', Y, '$$ $3', Z].join(' '), function() {
        before(function() {
          mmix.registers.$3 = Z;
          mmix.NEGU('$1', Y, '$3');
        });

        it('$1 <- ' + X, function() {
          expect(mmix.registers.$1).to.equal(X);
        });
      });
    });
  });

  describe('SL', function() {
    var tests = [
      //$Y, $Z, $X
      ['0000000000000000', '0000000000000000', '0000000000000000'],
      ['0000000000000001', '0000000000000000', '0000000000000001'],
      ['00000000FFFFFFFF', '0000000000000020', 'FFFFFFFF00000000'],
      ['FFFFFFFF00000000', '0000000000000004', 'FFFFFFF000000000'],
    ];

    tests.forEach(function(t) {
      var Y = t[0];
      var Z = t[1];
      var X = t[2];

      describe(['$2 ==', Y, '$$ $3 ==', Z].join(' '), function() {
        before(function() {
          mmix.registers.$2 = Y;
          mmix.registers.$3 = Z;
          mmix.SL('$1', '$2', '$3');
        });

        it('$1 <- ' + X, function() {
          expect(mmix.registers.$1).to.equal(X);
        });
      });
    });
  });

  describe('SR', function() {
    var tests = [
      //$Y, $Z, $X
      ['0000000000000000', '0000000000000000', '0000000000000000'],
      ['1000000000000000', '0000000000000000', '1000000000000000'],
      ['1000000000000000', '0000000000000001', '0800000000000000'],
      ['0000000000000008', '0000000000000001', '0000000000000004'],
      ['1111111111111111', '0000000000000020', '0000000011111111'],
      ['F000000000000000', '0000000000000040', 'FFFFFFFFFFFFFFFF'],
      ['8000000000000000', '0000000000000004', 'F800000000000000'],
    ];

    tests.forEach(function(t) {
      var Y = t[0];
      var Z = t[1];
      var X = t[2];

      describe(['$2 ==', Y, '$$ $3 ==', Z].join(' '), function() {
        before(function() {
          mmix.registers.$2 = Y;
          mmix.registers.$3 = Z;
        });

        it('$1 <- ' + X, function() {
          mmix.SR('$1', '$2', '$3');
          expect(mmix.registers.$1).to.equal(X);
        });
      });
    });
  });

  describe('SRU', function() {
    var tests = [
      //$Y, $Z, $X
      ['0000000000000000', '0000000000000000', '0000000000000000'],
      ['1000000000000000', '0000000000000000', '1000000000000000'],
      ['1000000000000000', '0000000000000001', '0800000000000000'],
      ['0000000000000008', '0000000000000001', '0000000000000004'],
      ['1111111111111111', '0000000000000020', '0000000011111111'],
      ['F000000000000000', '0000000000000040', '0000000000000000'],
      ['8000000000000000', '0000000000000004', '0800000000000000'],
    ];

    tests.forEach(function(t) {
      var Y = t[0];
      var Z = t[1];
      var X = t[2];

      describe(['$2 ==', Y, '$$ $3 ==', Z].join(' '), function() {
        before(function() {
          mmix.registers.$2 = Y;
          mmix.registers.$3 = Z;
        });

        it('$1 <- ' + X, function() {
          mmix.SRU('$1', '$2', '$3');
          expect(mmix.registers.$1).to.equal(X);
        });
      });
    });
  });

  describe('Comparisons', function() {
    var tests = [
      //Y, Z, CMP answer, CMPU answer
      ['0000000000000000', '0000000000000000', '0000000000000000', '0000000000000000'],
      ['FFFFFFFFFFFFFFFF', '7777777777777777', 'FFFFFFFFFFFFFFFF', '0000000000000001'],
    ];

    tests.forEach(function(t) {
      var Y = t[0];
      var Z = t[1];
      var sX = t[2];
      var uX = t[3];

      describe(['$2 ==', Y, '$$ $3 ==', Z].join(' '), function() {
        before(function() {
          mmix.registers.$2 = Y;
          mmix.registers.$3 = Z;
        });

        it('CMP($1, $2, $3) -> $1 == ' + sX, function() {
          mmix.CMP('$1', '$2', '$3');
          expect(mmix.registers.$1).to.equal(sX);
        });

        it('CMPU($1, $2, $3) -> $1 == ' + uX, function() {
          mmix.CMPU('$1', '$2', '$3');
          expect(mmix.registers.$1).to.equal(uX);
        });
      });
    });
  });
});
