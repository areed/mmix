exports.ADD = [
  [
    '20000102',
    {
      '$1': '0000000000000001',
      '$2': '0000000000000001',
    },
    {
      '$0': '0000000000000002',
    }
  ],
  [
    '20000102',
    {
      '$1': '0000000000000002',
      '$2': 'FFFFFFFFFFFFFFFE',
    },
    {
      '$0': '0000000000000000',
    }
  ],
  [
    '20000102',
    {
      '$1': 'FFFFFFFFFFFFFFFF',
      '$2': 'FFFFFFFFFFFFFFFF',
    },
    {
      '$0': 'FFFFFFFFFFFFFFFE',
    }
  ],
  [
    '20000102',
    {
      '$1': 'FFFFFFFFFFFFFFFF',
      '$2': '0000000000000002',
    },
    {
      '$0': '0000000000000001',
    }
  ],
  [
    '20000102',
    {
      '$1': '0000000000000003',
      '$2': '0000000000000000',
    },
    {
      '$0': '0000000000000003',
    }
  ],
  [
    '20000102',
    {
      '$1': '9E3779B97F4A7C16',
      '$2': '9E3779B97F4A7C16',
    },
    {
      '$0': '3C6EF372FE94F82C',
      'exceptions': '01000000',
    }
  ]
];

exports.ADDI = [
  [
    '21000101',
    {
      '$1': '0000000000000001',
    },
    {
      '$0': '0000000000000002',
    }
  ],
  [
    '21000202',
    {
      '$2': 'FFFFFFFFFFFFFFFE',
    },
    {
      '$0': '0000000000000000',
    }
  ],
  [
    '21000100',
    {
      '$1': 'FFFFFFFFFFFFFFFF',
    },
    {
      '$0': 'FFFFFFFFFFFFFFFF',
    }
  ],
  [
    '21000102',
    {
      '$1': 'FFFFFFFFFFFFFFFF',
    },
    {
      '$0': '0000000000000001',
    }
  ],
  [
    '21000100',
    {
      '$1': '0000000000000003',
    },
    {
      '$0': '0000000000000003',
    }
  ],
  [
    '210001A5',
    {
      '$1': '9E3779B97F4A7C16',
    },
    {
      '$0': '9E3779B97F4A7CBB',
    }
  ],
  [
    '210001FF',
    {
      '$1': '7FFFFFFFFFFFFFFF',
    },
    {
      '$0': '80000000000000FE',
      'exceptions': '01000000',
    }
  ]
];

exports.ADDU = [
  [
    '22000102',
    {
      '$1': '0000000000000001',
      '$2': '0000000000000001',
    },
    {
      '$0': '0000000000000002',
    }
  ],
  [
    '22000102',
    {
      '$1': '0000000000000002',
      '$2': 'FFFFFFFFFFFFFFFE',
    },
    {
      '$0': '0000000000000000',
    }
  ],
  [
    '22000102',
    {
      '$1': 'FFFFFFFFFFFFFFFF',
      '$2': 'FFFFFFFFFFFFFFFF',
    },
    {
      '$0': 'FFFFFFFFFFFFFFFE',
    }
  ],
  [
    '22000102',
    {
      '$1': 'FFFFFFFFFFFFFFFF',
      '$2': '0000000000000002',
    },
    {
      '$0': '0000000000000001',
    }
  ],
  [
    '22000102',
    {
      '$1': '0000000000000003',
      '$2': '0000000000000000',
    },
    {
      '$0': '0000000000000003',
    }
  ],
  [
    '22000102',
    {
      '$1': '9E3779B97F4A7C16',
      '$2': '9E3779B97F4A7C16',
    },
    {
      '$0': '3C6EF372FE94F82C',
    }
  ]
];

exports.ADDUI = [
  [
    '23000101',
    {
      '$1': '0000000000000001',
    },
    {
      '$0': '0000000000000002',
    }
  ],
  [
    '23000202',
    {
      '$2': 'FFFFFFFFFFFFFFFE',
    },
    {
      '$0': '0000000000000000',
    }
  ],
  [
    '23000100',
    {
      '$1': 'FFFFFFFFFFFFFFFF',
    },
    {
      '$0': 'FFFFFFFFFFFFFFFF',
    }
  ],
  [
    '23000102',
    {
      '$1': 'FFFFFFFFFFFFFFFF',
    },
    {
      '$0': '0000000000000001',
    }
  ],
  [
    '23000100',
    {
      '$1': '0000000000000003',
    },
    {
      '$0': '0000000000000003',
    }
  ],
  [
    '230001A5',
    {
      '$1': '9E3779B97F4A7C16',
    },
    {
      '$0': '9E3779B97F4A7CBB',
    }
  ],
  [
    '230001FF',
    {
      '$1': '0FFFFFFFFFFFFFFF',
    },
    {
      '$0': '10000000000000FE',
    }
  ]
];

exports['2ADDU'] = [
  [
    '28000102',
    {
      '$1': '0000000000000000',
      '$2': '0000000000000000',
    },
    {
      '$0': '0000000000000000',
    }
  ],
  [
    '28000102',
    {
      '$1': '2000000000000000',
      '$2': '0000000000000008',
    },
    {
      '$0': '4000000000000008'
    }
  ],
];

exports['2ADDUI'] = [
  ['29000100', {
    '$1': '0000000000000000',
  }, {
    '$0': '0000000000000000',
  }],
  ['29000108', {
    '$1': '2000000000000000',
  }, {
    '$0': '4000000000000008',
  }],
];

exports['4ADDU'] = [
  ['2A000102', {
    '$1': '0000000000000000',
    '$2': '0000000000000000',
  }, {
    '$0': '0000000000000000',
  }],
  ['2A000102', {
    '$1': '0000000000000008',
    '$2': '0000000000000002',
  }, {
    '$0': '0000000000000022',
  }],
];

exports['4ADDUI'] = [
  ['2B000100', {
    '$1': '0000000000000000',
    '$2': '0000000000000000',
  }, {
    '$0': '0000000000000000',
  }],
  ['2B000102', {
    '$1': '0000000000000008',
  }, {
    '$0': '0000000000000022',
  }],
];

exports['8ADDU'] = [
  ['2C000102', {
    '$1': '0000000000000100',
    '$2': '00000000000000FF',
  }, {
    '$0': '00000000000008FF',
  }],
  ['2C000102', {
    '$1': '2000000000000100',
    '$2': '0000000000000088',
  }, {
    '$0': '0000000000000888',
  }],
];

exports['8ADDUI'] = [
  ['2D0001FF', {
    '$1': '0000000000000100',
  }, {
    '$0': '00000000000008FF',
  }],
  ['2D000188', {
    '$1': '2000000000000100',
  }, {
    '$0': '0000000000000888',
  }],
];

exports['16ADDU'] = [
  ['2E000102', {
    '$1': '0000000000000100',
    '$2': '0000000000000010',
  }, {
    '$0': '0000000000001010',
  }],
  ['2E000102', {
    '$1': '2000000000000000',
    '$2': '0000000000000004',
  }, {
    '$0': '0000000000000004',
  }],
];

exports['16ADDUI'] = [
  ['2F000110', {
    '$1': '0000000000000100',
  }, {
    '$0': '0000000000001010',
  }],
  ['2F000104', {
    '$1': '2000000000000000',
  }, {
    '$0': '0000000000000004',
  }],
];

exports.SUB = [

  /*
    ['0000000000000001', '0000000000000001'],
    ['0000000000000002', 'FFFFFFFFFFFFFFFE'],
    ['FFFFFFFFFFFFFFFF', 'FFFFFFFFFFFFFFFF'],
    ['FFFFFFFFFFFFFFFF', '0000000000000002'],
    ['0000000000000003', '0000000000000000'],
    ['9e3779b97f4a7c16', '9e3779b97f4a7c16'],

  test('SUB', [
    ['0000000000000000'],
    ['0000000000000004'],
    ['0000000000000000'],
    ['FFFFFFFFFFFFFFFD'],
    ['0000000000000003'],
    ['0000000000000000'],
  ]);
  */
];

exports.SUBI = [

];

exports.SUBU = [

  /*
  test('SUBU', [
    ['0000000000000000'],
    ['0000000000000004'],
    ['0000000000000000'],
    ['FFFFFFFFFFFFFFFD'],
    ['0000000000000003'],
    ['0000000000000000'],
  ]);
  */
];

exports.SUBUI = [

];

exports.MUL = [

  /*
  test('MUL', [
    ['0000000000000001'],
    ['FFFFFFFFFFFFFFFC'],
    ['0000000000000001'],
    ['FFFFFFFFFFFFFFFE'],
    ['0000000000000000'],
    ['1BB32095CCDD51E4'],
  ]);
  */
];

exports.MULI = [

];

exports.MULU = [

  /*
  test('MULU', [
    ['0000000000000001', '0000000000000000'],
    ['FFFFFFFFFFFFFFFC', '0000000000000001'],
    ['0000000000000001', 'FFFFFFFFFFFFFFFE'],
    ['FFFFFFFFFFFFFFFE', '0000000000000001'],
    ['0000000000000000', '0000000000000000'],
    ['1BB32095CCDD51E4', '61C8864680B583EA'],
  ]);
  */
];

exports.MULUI = [

];

exports.DIV = [
  ['1C000102', {
    '$1': '0000000000000001',
    '$2': '0000000000000001',
  }, {
    '$0': '0000000000000001',
    'rR': '0000000000000000',
  }],
  ['1C000102', {
    '$1': '0000000000000002',
    '$2': 'FFFFFFFFFFFFFFFE',
  }, {
    '$0': 'FFFFFFFFFFFFFFFF',
    'rR': '0000000000000000',
  }],
  ['1C000102', {
    '$1': 'FFFFFFFFFFFFFFFF',
    '$2': 'FFFFFFFFFFFFFFFF',
  }, {
    '$0': '0000000000000001',
    'rR': '0000000000000000',
  }],
  ['1C000102', {
    '$1': 'FFFFFFFFFFFFFFFF',
    '$2': '0000000000000002',
  }, {
    '$0': 'FFFFFFFFFFFFFFFF',
    'rR': '0000000000000001',
  }],
  ['1C000102', { //divide by zero
    '$1': '0000000000000003',
    '$2': '0000000000000000',
  }, {
    '$0': '0000000000000000',
    'rR': '0000000000000003',
    'exceptions': '10000000',
  }],
  ['1C000102', {
    '$1': '9E3779B97F4A7C16',
    '$2': '9E3779B97F4A7C16',
  }, {
    '$0': '0000000000000001',
    'rR': '0000000000000000',
  }],
  ['1C000102', { //integer overflow
    '$1': '8000000000000000',
    '$2': 'FFFFFFFFFFFFFFFF',
  }, {
    '$0': '8000000000000000',
    'rR': '0000000000000000',
    'exceptions': '01000000',
  }],
  ['1C000102', {
    '$1': '0000000000000005',
    '$2': 'FFFFFFFFFFFFFFFE',
  }, {
    '$0': 'FFFFFFFFFFFFFFFD',
    'rR': 'FFFFFFFFFFFFFFFF',
  }],
];

exports.DIVI = [
  ['1D000101', {
    '$1': '0000000000000001',
  }, {
    '$0': '0000000000000001',
    'rR': '0000000000000000',
  }],
  ['1D0001FE', {
    '$1': '0000000000000002',
  }, {
    '$0': '0000000000000000',
    'rR': '0000000000000002',
  }],
  ['1D000102', {
    '$1': 'FFFFFFFFFFFFFFFE',
  }, {
    '$0': 'FFFFFFFFFFFFFFFF',
    'rR': '0000000000000000',
  }],
  ['1D000102', {
    '$1': 'FFFFFFFFFFFFFFFF',
  }, {
    '$0': 'FFFFFFFFFFFFFFFF',
    'rR': '0000000000000001',
  }],
  ['1D000100', { //divide by zero
    '$1': '0000000000000003',
  }, {
    '$0': '0000000000000000',
    'rR': '0000000000000003',
    'exceptions': '10000000',
  }],
  ['1D000101', {
    '$1': '9E3779B97F4A7C16',
  }, {
    '$0': '9E3779B97F4A7C16',
    'rR': '0000000000000000',
  }],
  ['1D000102', {
    '$1': 'FFFFFFFFFFFFFFFB',
  }, {
    '$0': 'FFFFFFFFFFFFFFFD',
    'rR': '0000000000000001',
  }],
];

exports.DIVU = [
  ['1E000102', {
    '$1': '0000000000000001',
    '$2': '0000000000000001',
    'rD': '0000000000000001',
  }, {
    '$0': '0000000000000001',
    'rR': '0000000000000001',
  }],
  ['1E000102', {
    '$1': 'FFFFFFFFFFFFFFFF',
    '$2': 'FFFFFFFFFFFFFFFF',
    'rD': '0000000000000000',
  }, {
    '$0': '0000000000000001',
    'rR': '0000000000000000',
  }],
  ['1E000102', {
    '$1': '0000000000000002',
    '$2': 'FFFFFFFFFFFFFFFE',
    'rD': '8765432109ABCDEF',
  }, {
    '$0': '8765432109ABCDF0',
    'rR': '0ECA864213579BE2',
  }],
  ['1E000102', {
    '$1': 'FFFFFFFFFFFFFFFF',
    '$2': '0000000000000002',
    'rD': '0000000011111111',
  }, {
    '$0': '0000000011111111',
    'rR': 'FFFFFFFFFFFFFFFF'
  }],
  ['1E000102', {
    '$1': '0000000000000003',
    '$2': '0000000000000000',
    'rD': '0000000000000003',
  }, {
    '$0': '0000000000000003',
    'rR': '0000000000000003',
  }],
  ['1E000102', {
    '$1': '9e3779b97f4a7c16',
    '$2': '9e3779b97f4a7c16',
    'rD': '9e3779b97f4a7c16',
  }, {
    '$0': '9e3779b97f4a7c16',
    'rR': '9e3779b97f4a7c16',
  }],
];

exports.DIVUI = [
  ['1F000101', {
    '$1': '0000000000000001',
    'rD': '0000000000000001',
  }, {
    '$0': '0000000000000001',
    'rR': '0000000000000001',
  }],
  ['1F000102', {
    '$1': 'FFFFFFFFFFFFFFFF',
    'rD': '0000000000000000',
  }, {
    '$0': '7FFFFFFFFFFFFFFF',
    'rR': '0000000000000001',
  }],
  ['1F0001FF', {
    '$1': '0000000000000002',
    'rD': '8765432109ABCDEF',
  }, {
    '$0': '8765432109ABCDEF',
    'rR': '0000000000000002',
  }],
  ['1F000102', {
    '$1': 'FFFFFFFFFFFFFFFF',
    'rD': '0000000011111111',
  }, {
    '$0': '0000000011111111',
    'rR': 'FFFFFFFFFFFFFFFF'
  }],
  ['1F000100', {
    '$1': '0000000000000003',
    'rD': '0000000000000003',
  }, {
    '$0': '0000000000000003',
    'rR': '0000000000000003',
  }],
];

exports.NEG = [

  /*
      //Y, $Z, $X
      ['00', '0000000000000001', 'FFFFFFFFFFFFFFFF'],
      ['00', 'FFFFFFFFFFFFFFFF', '0000000000000001'],
      ['FF', '000000000000007F', '0000000000000080'],
      ['FF', '0000000000000100', 'FFFFFFFFFFFFFFFF'],
      ['FF', 'FFFFFFFFFFFFFFFF', '0000000000000100'],
    ];
    */
];

exports.NEGI = [

];

exports.NEGU = [

  /*
      //Y, $Z, $X
      ['00', '0000000000000001', 'FFFFFFFFFFFFFFFF'],
      ['00', 'FFFFFFFFFFFFFFFF', '0000000000000001'],
      ['FF', '000000000000007F', '0000000000000080'],
      ['FF', '0000000000000100', 'FFFFFFFFFFFFFFFF'],
      ['FF', 'FFFFFFFFFFFFFFFF', '0000000000000100'],
      */
];

exports.NEGUI = [

];
