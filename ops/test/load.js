exports.LDB = [
  //load a positive signed byte
  ['80000102', {
    '$1': '2000000000000100',
    '$2': '0000000000000002',
    '2000000000000102': '45',
  },
  {
    //sign-extended with 0's
    '$0': '0000000000000045',
  }],
  //load a negative signed byte
  ['80000102', {
    '$1': '2000000000000100',
    '$2': '0000000000000005',
    '2000000000000105': 'AB',
  },
  {
    //sign-extended with 1's
    '$0': 'FFFFFFFFFFFFFFAB',
  }],
  //address computation overflows
  ['80010203', {
    $2: 'FFFFFFFFFFFFFFFF',
    $3: '0000000000000004',
    '0000000000000003': 'CC',
  }, {
    //no exception occurs
    $1: 'FFFFFFFFFFFFFFCC',
  }],
  //uninitialized memory
  ['80010203', {
    $2: '8000000000000000',
    $3: '8000000000000000',
  }, {
    //all 0's
    $1: '0000000000000000',
  }],
];

exports.LDBI = [
  //load a positive signed byte
  ['81000102', {
    $1: '2000000000000100',
    '2000000000000102': '45',
  }, {
    //sign-extended with 0's
    $0: '0000000000000045',
  }],
  //load a negative signed byte
  ['81000105', {
    $1: '2000000000000100',
    '2000000000000105': 'AB',
  }, {
    //sign-extended with 1's
    $0: 'FFFFFFFFFFFFFFAB',
  }],
  //address computation overflows
  ['81000104', {
    $1: 'FFFFFFFFFFFFFFFF',
    '0000000000000003': '77',
  }, {
    //no exception occurs
    $0: '0000000000000077',
  }],
  //uninitialized memory
  ['81000100', {
    $1: '0000000000000000',
  }, {
    //all 0's
    $0: '0000000000000000',
  }],
];

exports.LDBU = [
  //load byte that would be positive if signed
  ['82000102', {
    $1: '2000000000000100',
    $2: '0000000000000002',
    '2000000000000102': '45',
  }, {
    //padded with 0's
    $0: '0000000000000045',
  }],
  //load byte that would be negative if signed
  ['82000102', {
    $1: '2000000000000100',
    $2: '0000000000000005',
    '2000000000000105': 'AB',
  }, {
    //padded with 0's
    $0: '00000000000000AB',
  }],
  //address computation overflows
  ['82000102', {
    $1: 'FFFFFFFFFFFFFFFF',
    $2: '0000000000000001',
    '0000000000000000': '9B',
  }, {
    //no exception occurs
    $0: '000000000000009B',
  }],
  //load byte from uninitialized memory
  ['82000102', {
    $1: '0000000000000000',
    $2: '2000000000000000',
  }, {
    //all 0's
    $0: '0000000000000000',
  }],
];

exports.LDBUI = [
  //load byte that would be positive if signed
  ['83000102', {
    $1: '2000000000000100',
    '2000000000000102': '45',
  }, {
    //padded with 0's
    $0: '0000000000000045'
  }],
  //load byte that would be negative if signed
  ['83000105', {
    $1: '2000000000000100',
    '2000000000000105': '45',
  }, {
    //padded with 0's
    $0: '0000000000000045',
  }],
  //address computation overflows
  ['830001FF', {
    $1: 'FFFFFFFFFFFFFF10',
    '000000000000000F': 'AA',
  }, {
    //no exception occurs
    $0: '00000000000000AA',
  }],
  //uninitialized memory
  ['83000100', {
    $1: '2000000000000000',
  }, {
    //all 0's
    $0: '0000000000000000',
  }],
];

exports.LDW = [
  [
    //signed wyde would be positive
    '84000102',
    {
      '$1': '2000000000000100',
      '$2': '0000000000000002',
      '2000000000000102': '45',
      '2000000000000103': '67',
    },
    {
      '$0': '0000000000004567'
    }
  ],
  [
    //signed wyde would be negative
    '84000102',
    {
      '$1': '2000000000000100',
      '$2': '0000000000000005',
      '2000000000000104': '89',
      '2000000000000105': 'AB',
    },
    {
      '$0': 'FFFFFFFFFFFF89AB'
    }
  ]
];

exports.LDWI = [
  [
    //signed wyde would be positive
    '85000102',
    {
      '$1': '2000000000000100',
      '2000000000000102': '45',
      '2000000000000103': '67',
    },
    {
      '$0': '0000000000004567'
    }
  ],
  [
    //signed wyde would be negative
    '85000105',
    {
      '$1': '2000000000000100',
      '2000000000000104': '89',
      '2000000000000105': 'AB',
    },
    {
      '$0': 'FFFFFFFFFFFF89AB'
    }
  ]
];

exports.LDWU = [
  [
    //signed wyde would be positive
    '86000102',
    {
      '$1': '2000000000000100',
      '$2': '0000000000000002',
      '2000000000000102': '45',
      '2000000000000103': '67',
    },
    {
      '$0': '0000000000004567',
    }
  ],
  [
    //signed wyde would be negative
    '86000102',
    {
      '$1': '2000000000000100',
      '$2': '0000000000000005',
      '2000000000000104': '89',
      '2000000000000105': 'AB',
    },
    {
      '$0': '00000000000089AB'
    }
  ],
];

exports.LDWUI = [
  [
    //signed wyde would be positive
    '87000102',
    {
      '$1': '2000000000000100',
      '2000000000000102': '45',
      '2000000000000103': '67',
    },
    {
      '$0': '0000000000004567',
    }
  ],
  [
    //signed wyde would be negative
    '87000105',
    {
      '$1': '2000000000000100',
      '2000000000000104': '89',
      '2000000000000105': 'AB',
    },
    {
      '$0': '00000000000089AB',
    }
  ],
];

exports.LDT = [
  [
    //signed tetra would be positive
    '88000102',
    {
      '$1': '2000000000000100',
      '$2': '0000000000000002',
      '2000000000000100': '01',
      '2000000000000101': '23',
      '2000000000000102': '45',
      '2000000000000103': '67',
    },
    {
      '$0': '0000000001234567',
    }
  ],
  [
    //signed tetra would be negative
    '88000102',
    {
      '$1': '2000000000000100',
      '$2': '0000000000000005',
      '2000000000000104': '89',
      '2000000000000105': 'AB',
      '2000000000000106': 'CD',
      '2000000000000107': 'EF',
    },
    {
      '$0': 'FFFFFFFF89ABCDEF'
    }
  ],
];

exports.LDTI = [
  [
    //signed tetra would be positive
    '89000102',
    {
      '$1': '2000000000000100',
      '2000000000000100': '01',
      '2000000000000101': '23',
      '2000000000000102': '45',
      '2000000000000103': '67',
    },
    {
      '$0': '0000000001234567'
    }
  ],
  [
    //signed tetra would be negative
    '89000105',
    {
      '$1': '2000000000000100',
      '2000000000000104': '89',
      '2000000000000105': 'AB',
      '2000000000000106': 'CD',
      '2000000000000107': 'EF',
    },
    {
      '$0': 'FFFFFFFF89ABCDEF',
    }
  ],
];

exports.LDTU = [
  [
    //signed tetra would be positive
    '8A000102',
    {
      '$1': '2000000000000100',
      '$2': '0000000000000002',
      '2000000000000100': '01',
      '2000000000000101': '23',
      '2000000000000102': '45',
      '2000000000000103': '67',
    },
    {
      '$0': '0000000001234567'
    }
  ],
  [
    //signed tetra would be negative
    '8A000102',
    {
      '$1': '2000000000000100',
      '$2': '0000000000000005',
      '2000000000000104': '89',
      '2000000000000105': 'AB',
      '2000000000000106': 'CD',
      '2000000000000107': 'EF',
    },
    {
      '$0': '0000000089ABCDEF'
    }
  ],
];

exports.LDTUI = [
  [
    //signed tetra would be positive
    '8B000102',
    {
      '$1': '2000000000000100',
      '2000000000000100': '01',
      '2000000000000101': '23',
      '2000000000000102': '45',
      '2000000000000103': '67',
    },
    {
      '$0': '0000000001234567',
    }
  ],
  [
    //signed tetra would be negative
    '8B000105',
    {
      '$1': '2000000000000100',
      '2000000000000104': '89',
      '2000000000000105': 'AB',
      '2000000000000106': 'CD',
      '2000000000000107': 'EF',
    },
    {
      '$0': '0000000089ABCDEF'
    }
  ]
];

exports.LDHT = [
  [
    //signed tetra would be positive
    '92000102',
    {
      '$1': '2000000000000100',
      '$2': '0000000000000002',
      '2000000000000100': '01',
      '2000000000000101': '23',
      '2000000000000102': '45',
      '2000000000000103': '67',
    },
    {
      '$0': '0123456700000000',
    }
  ],
  [
    //signed tetra would be negative
    '92000102',
    {
      '$1': '2000000000000100',
      '$2': '0000000000000005',
      '2000000000000104': '89',
      '2000000000000105': 'AB',
      '2000000000000106': 'CD',
      '2000000000000107': 'EF',
    },
    {
      '$0': '89ABCDEF00000000'
    }
  ],
];

exports.LDHTI = [
  [
    //signed tetra would be positive
    '93000102',
    {
      '$1': '2000000000000100',
      '2000000000000100': '01',
      '2000000000000101': '23',
      '2000000000000102': '45',
      '2000000000000103': '67',
    },
    {
      '$0': '0123456700000000'
    }
  ],
  [
    //signed tetra would be negative
    '93000105',
    {
      '$1': '2000000000000100',
      '2000000000000104': '89',
      '2000000000000105': 'AB',
      '2000000000000106': 'CD',
      '2000000000000107': 'EF',
    },
    {
      '$0': '89ABCDEF00000000',
    }
  ],
];

exports.LDO = [
  [
    '8C000102',
    {
      '$1': '2000000000000100',
      '2000000000000100': '01',
      '2000000000000101': '23',
      '2000000000000102': '45',
      '2000000000000103': '67',
      '2000000000000104': '89',
      '2000000000000105': 'AB',
      '2000000000000106': 'CD',
      '2000000000000107': 'EF',
    },
    {
      '$0': '0123456789ABCDEF',
    }
  ]
];

exports.LDOI = [
  [
    '8D000102',
    {
      '$1': '2000000000000100',
      '2000000000000100': '01',
      '2000000000000101': '23',
      '2000000000000102': '45',
      '2000000000000103': '67',
      '2000000000000104': '89',
      '2000000000000105': 'AB',
      '2000000000000106': 'CD',
      '2000000000000107': 'EF',
    },
    {
      '$0': '0123456789ABCDEF',
    }
  ]
];

exports.LDOU = [
  [
    '8E000102',
    {
      '$1': '2000000000000100',
      '2000000000000100': '01',
      '2000000000000101': '23',
      '2000000000000102': '45',
      '2000000000000103': '67',
      '2000000000000104': '89',
      '2000000000000105': 'AB',
      '2000000000000106': 'CD',
      '2000000000000107': 'EF',
    },
    {
      '$0': '0123456789ABCDEF',
    }
  ]
];

exports.LDOUI = [
  [
    '8F000102',
    {
      '$1': '2000000000000100',
      '2000000000000100': '01',
      '2000000000000101': '23',
      '2000000000000102': '45',
      '2000000000000103': '67',
      '2000000000000104': '89',
      '2000000000000105': 'AB',
      '2000000000000106': 'CD',
      '2000000000000107': 'EF',
    },
    {
      '$0': '0123456789ABCDEF',
    }
  ]
];

exports.LDA = [
  ['22000102', {
    '$1': '2000000000000100',
    '$2': '0000000000000002',
  }, {
    $0: '2000000000000102',
  }],
  ['22000102', {
    '$1': '2000000000000100',
    '$2': '0000000000000005',
  }, {
    '$0': '2000000000000105',
  }],
  ['22010203', {
    $2: 'FFFFFFFFFFFFFFFF',
    $3: '0000000000000004',
  }, {
    $1: '0000000000000003',
  }],
  ['22010203', {
    $2: '8000000000000000',
    $3: '8000000000000000',
  }, {
    $1: '0000000000000000',
  }],
];