var test = require('./templates').wyde;


describe.only('Immediate Constants', function() {
  test('SETH', [
    ['0000', '0000000000000000'],
    ['FFFF', 'FFFF000000000000'],
    ['0123', '0123000000000000'],
  ]);

  test('SETMH', [
    ['4567', '0000456700000000'],
  ]);


  test('SETML', [
    ['89AB', '0000000089AB0000'],
  ]);

  test('SETL', [
    ['CDEF', '000000000000CDEF'],
  ]);
});
