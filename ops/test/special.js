exports.GET = [
  ['FE000014', {
    rL: '0123456789ABCDEF'
  }, {
    $0: '0123456789ABCDEF',
  }],
];

exports.PUT = [
  ['F6140001', {
    $1: '0123456789ABCDEF',
  }, {
    rL: '0123456789ABCDEF',
  }],
];

exports.PUTI = [
  ['F71400FF', {},{
    rL: '00000000000000FF',
  }],
];
