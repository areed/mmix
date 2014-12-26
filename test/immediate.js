var test = require('./templates').wyde;


describe.only('Immediate Constants', function() {
  test('SETH', [
    ['0000', '0000000000000000'],
    ['FFFF', 'FFFF000000000000'],
    ['0123', '0123000000000000'],
  ]);
});
