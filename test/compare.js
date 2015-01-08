
/*
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
*/
