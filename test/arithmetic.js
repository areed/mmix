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
