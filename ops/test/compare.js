exports.CMP = [
  ['30010203', {
    $2: '0000000000000000',
    $3: '0000000000000000',
  }, {
    $1: '0000000000000000',
  }],
  ['30010203', {
    $2: 'FFFFFFFFFFFFFFFF',
    $3: '7777777777777777',
  }, {
    $1: 'FFFFFFFFFFFFFFFF',
  }],
];

exports.CMPI = [
  ['31010200', {
    $2: '0000000000000000',
  }, {
    $1: '0000000000000000',
  }],
  ['31010277', {
    $2: 'FFFFFFFFFFFFFFFF',
  }, {
    $1: 'FFFFFFFFFFFFFFFF',
  }],
];

exports.CMPU = [
  ['32010203', {
    $2: '0000000000000000',
    $3: '0000000000000000',
  }, {
    $1: '0000000000000000',
  }],
  ['32010203', {
    $2: 'FFFFFFFFFFFFFFFF',
    $3: '7777777777777777',
  }, {
    $1: '0000000000000001',
  }],
];

exports.CMPUI = [
  ['33010200', {
    $2: '0000000000000000',
  }, {
    $1: '0000000000000000',
  }],
  ['33010277', {
    $2: 'FFFFFFFFFFFFFFFF',
  }, {
    $1: '0000000000000001',
  }],
];