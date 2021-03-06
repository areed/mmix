exports.STB = [
  [
    //STB $0, $1, $2 with positive signed byte
    'A0000102',
    {
      '$0': '0000000000000045',
      '$1': '2000000000000100',
      '$2': '0000000000000002',
    },
    {
      '2000000000000102': '45',
    }
  ],
  [
    //STB $0, $1, $2 with negative signed byte
    'A0000102',
    {
      '$0': 'FFFFFFFFFFFFFFAB',
      '$1': '2000000000000100',
      '$2': '0000000000000005',
    },
    {
      '2000000000000105': 'AB',
    }
  ],
  [
    //STB $0, $1, $2 with positive overflow
    'A0000102',
    {
      '$0': '0000000000000100',
      '$1': '2000000000000100',
      '$2': '0000000000000002',
    },
    {
      '2000000000000102': '00',
      'exceptions': '01000000',
    }
  ],
  [
    //STB $0, $1, $2 with negative overflow
    'A0000102',
    {
      '$0': '8000000000000002',
      '$1': '2000000000000100',
      '$2': '0000000000000002',
    },
    {
      '2000000000000102': '02',
      'exceptions': '01000000',
    }
  ],
];

exports.STBI = [
  [
    //STBI $0, $1, $2 with positive signed byte
    'A1000102',
    {
      '$0': '0000000000000045',
      '$1': '2000000000000100',
    },
    {
      '2000000000000102': '45',
    }
  ],
  [
    //STBI $0, $1, $2 with negative signed byte
    'A1000102',
    {
      '$0': 'FFFFFFFFFFFFFFAB',
      '$1': '2000000000000100',
    },
    {
      '2000000000000102': 'AB',
    }
  ],
  [
    //STBI $0, $1, $2 with positive overflow
    'A1000102',
    {
      '$0': '0000000000000100',
      '$1': '2000000000000100',
    },
    {
      '2000000000000102': '00',
      'exceptions': '01000000',
    }
  ],
  [
    //STBI $0, $1, $2 with negative overflow
    'A1000102',
    {
      '$0': '8000000000000002',
      '$1': '2000000000000100',
    },
    {
      '2000000000000102': '02',
      'exceptions': '01000000',
    }
  ],
];

exports.STBU = [
  [
    //STBU $0, $1, $2 with positive signed byte
    'A2000102',
    {
      '$0': '0000000000000045',
      '$1': '2000000000000100',
      '$2': '0000000000000002',
    },
    {
      '2000000000000102': '45',
    }
  ],
  [
    //STBU $0, $1, $2 with negative signed byte
    'A2000102',
    {
      '$0': 'FFFFFFFFFFFFFFAB',
      '$1': '2000000000000100',
      '$2': '0000000000000005',
    },
    {
      '2000000000000105': 'AB',
    }
  ],
  [
    //STBU $0, $1, $2 with positive overflow
    'A2000102',
    {
      '$0': '0000000000000100',
      '$1': '2000000000000100',
      '$2': '0000000000000002',
    },
    {
      '2000000000000102': '00',
    }
  ],
  [
    //STBU $0, $1, $2 with negative overflow
    'A2000102',
    {
      '$0': '8000000000000002',
      '$1': '2000000000000100',
      '$2': '0000000000000002',
    },
    {
      '2000000000000102': '02',
    }
  ],
];

exports.STBUI = [
  [
    //STBUI $0, $1, $2 with positive signed byte
    'A3000102',
    {
      '$0': '0000000000000045',
      '$1': '2000000000000100',
    },
    {
      '2000000000000102': '45',
    }
  ],
  [
    //STBUI $0, $1, $2 with negative signed byte
    'A3000102',
    {
      '$0': 'FFFFFFFFFFFFFFAB',
      '$1': '2000000000000100',
    },
    {
      '2000000000000102': 'AB',
    }
  ],
  [
    //STBUI $0, $1, $2 with positive overflow
    'A3000102',
    {
      '$0': '0000000000000100',
      '$1': '2000000000000100',
    },
    {
      '2000000000000102': '00',
    }
  ],
  [
    //STBUI $0, $1, $2 with negative overflow
    'A3000102',
    {
      '$0': '8000000000000002',
      '$1': '2000000000000100',
    },
    {
      '2000000000000102': '02',
    }
  ],
];

exports.STW = [
  [
    //STW $0, $1, $2 with positive signed byte
    'A4000102',
    {
      '$0': '0000000000002345',
      '$1': '2000000000000100',
      '$2': '0000000000000002',
    },
    {
      '2000000000000102': '23',
      '2000000000000103': '45',
    }
  ],
  [
    //STW $0, $1, $2 with negative signed byte
    'A4000102',
    {
      '$0': 'FFFFFFFFFFFFCDEF',
      '$1': '2000000000000100',
      '$2': '0000000000000002',
    },
    {
      '2000000000000102': 'CD',
      '2000000000000103': 'EF',
    }
  ],
  [
    //STW $0, $1, $2 with positive overflow and misaligned address
    'A4000102',
    {
      '$0': '0000000000012345',
      '$1': '2000000000000100',
      '$2': '0000000000000003',
    },
    {
      '2000000000000102': '23',
      '2000000000000103': '45',
      'exceptions': '01000000',
    }
  ],
  [
    //STW $0, $1, $2 with negative overflow and misaligned address
    'A4000102',
    {
      '$0': '8000000000004567',
      '$1': '2000000000000100',
      '$2': '0000000000000005',
    },
    {
      '2000000000000104': '45',
      '2000000000000105': '67',
      'exceptions': '01000000',
    }
  ]
];

exports.STWI = [
  [
    //STWI $0, $1, $2 with positive signed byte
    'A5000102',
    {
      '$0': '0000000000002345',
      '$1': '2000000000000100',
    },
    {
      '2000000000000102': '23',
      '2000000000000103': '45',
    }
  ],
  [
    //STWI $0, $1, $2 with negative signed byte
    'A5000102',
    {
      '$0': 'FFFFFFFFFFFFCDEF',
      '$1': '2000000000000100',
    },
    {
      '2000000000000102': 'CD',
      '2000000000000103': 'EF',
    }
  ],
  [
    //STWI $0, $1, $2 with positive overflow and misaligned address
    'A5000103',
    {
      '$0': '0000000000012345',
      '$1': '2000000000000100',
    },
    {
      '2000000000000102': '23',
      '2000000000000103': '45',
      'exceptions': '01000000',
    }
  ],
  [
    //STWI $0, $1, $2 with negative overflow and misaligned address
    'A5000105',
    {
      '$0': '8000000000004567',
      '$1': '2000000000000100',
    },
    {
      '2000000000000104': '45',
      '2000000000000105': '67',
      'exceptions': '01000000',
    }
  ]
];

exports.STWU = [
  [
    //STWU $0, $1, $2 with positive signed byte
    'A6000102',
    {
      '$0': '0000000000002345',
      '$1': '2000000000000100',
      '$2': '0000000000000002',
    },
    {
      '2000000000000102': '23',
      '2000000000000103': '45',
    }
  ],
  [
    //STWU $0, $1, $2 with negative signed byte
    'A6000102',
    {
      '$0': 'FFFFFFFFFFFFCDEF',
      '$1': '2000000000000100',
      '$2': '0000000000000002',
    },
    {
      '2000000000000102': 'CD',
      '2000000000000103': 'EF',
    }
  ],
  [
    //STWU $0, $1, $2 with positive overflow and misaligned address
    'A6000102',
    {
      '$0': '0000000000012345',
      '$1': '2000000000000100',
      '$2': '0000000000000003',
    },
    {
      '2000000000000102': '23',
      '2000000000000103': '45',
    }
  ],
  [
    //STWU $0, $1, $2 with negative overflow and misaligned address
    'A6000102',
    {
      '$0': '8000000000004567',
      '$1': '2000000000000100',
      '$2': '0000000000000005',
    },
    {
      '2000000000000104': '45',
      '2000000000000105': '67',
    }
  ]
];

exports.STWUI = [
  [
    //STWUI $0, $1, 02 with positive signed byte
    'A7000102',
    {
      '$0': '0000000000002345',
      '$1': '2000000000000100',
    },
    {
      '2000000000000102': '23',
      '2000000000000103': '45',
    }
  ],
  [
    //STWUI $0, $1, 02 with negative signed byte
    'A7000102',
    {
      '$0': 'FFFFFFFFFFFFCDEF',
      '$1': '2000000000000100',
    },
    {
      '2000000000000102': 'CD',
      '2000000000000103': 'EF',
    }
  ],
  [
    //STWUI $0, $1, 03 with positive overflow and misaligned address
    'A7000103',
    {
      '$0': '0000000000012345',
      '$1': '2000000000000100',
    },
    {
      '2000000000000102': '23',
      '2000000000000103': '45',
    }
  ],
  [
    //STWUI $0, $1, 05 with negative overflow and misaligned address
    'A7000105',
    {
      '$0': '800000000000CDEF',
      '$1': '2000000000000100',
    },
    {
      '2000000000000104': 'CD',
      '2000000000000105': 'EF',
    }
  ]
];

exports.STT = [
  [
    //STT $0, $1, $2 with positive signed tetra
    'A8000102',
    {
      '$0': '0000000001234567',
      '$1': '2000000000000100',
      '$2': '0000000000000004',
    },
    {
      '2000000000000104': '01',
      '2000000000000105': '23',
      '2000000000000106': '45',
      '2000000000000107': '67',
    }
  ],
  [
    //STT $0, $1, $2 with negative signed tetra and misaligned address
    'A8000102',
    {
      '$0': 'FFFFFFFF89ABCDEF',
      '$1': '2000000000000100',
      '$2': '0000000000000002',
    },
    {
      '2000000000000100': '89',
      '2000000000000101': 'AB',
      '2000000000000102': 'CD',
      '2000000000000103': 'EF',
    }
  ],
  [
    //STT $0, $1, $2 with positive overflow and misaligned address
    'A8000102',
    {
      '$0': '0000000123456789',
      '$1': '2000000000000100',
      '$2': '0000000000000003',
    },
    {
      '2000000000000100': '23',
      '2000000000000101': '45',
      '2000000000000102': '67',
      '2000000000000103': '89',
      'exceptions': '01000000',
    }
  ],
  [
    //STT $0, $1, $2 with negative overflow and misaligned address
    'A8000102',
    {
      '$0': '8000000087654321',
      '$1': '2000000000000100',
      '$2': '0000000000000005',
    },
    {
      '2000000000000104': '87',
      '2000000000000105': '65',
      '2000000000000106': '43',
      '2000000000000107': '21',
      'exceptions': '01000000',
    }
  ]
];

exports.STTI = [
  [
    //STTI $0, $1, 04 with positive signed tetra
    'A9000104',
    {
      '$0': '0000000001234567',
      '$1': '2000000000000100',
    },
    {
      '2000000000000104': '01',
      '2000000000000105': '23',
      '2000000000000106': '45',
      '2000000000000107': '67',
    }
  ],
  [
    //STT $0, $1, 02 with negative signed tetra and misaligned address
    'A9000102',
    {
      '$0': 'FFFFFFFF89ABCDEF',
      '$1': '2000000000000100',
    },
    {
      '2000000000000100': '89',
      '2000000000000101': 'AB',
      '2000000000000102': 'CD',
      '2000000000000103': 'EF',
    }
  ],
  [
    //STTI $0, $1, 03 with positive overflow and misaligned address
    'A9000103',
    {
      '$0': '0000000123456789',
      '$1': '2000000000000100',
    },
    {
      '2000000000000100': '23',
      '2000000000000101': '45',
      '2000000000000102': '67',
      '2000000000000103': '89',
      'exceptions': '01000000',
    }
  ],
  [
    //STTI $0, $1, 05 with negative overflow and misaligned address
    'A9000105',
    {
      '$0': '8000000087654321',
      '$1': '2000000000000100',
    },
    {
      '2000000000000104': '87',
      '2000000000000105': '65',
      '2000000000000106': '43',
      '2000000000000107': '21',
      'exceptions': '01000000',
    }
  ]
];

exports.STTU = [
  [
    //STTU $0, $1, $2 with positive signed tetra
    'AA000102',
    {
      '$0': '0000000001234567',
      '$1': '2000000000000100',
      '$2': '0000000000000004',
    },
    {
      '2000000000000104': '01',
      '2000000000000105': '23',
      '2000000000000106': '45',
      '2000000000000107': '67',
    }
  ],
  [
    //STTU $0, $1, $2 with negative signed tetra and misaligned address
    'AA000102',
    {
      '$0': 'FFFFFFFF89ABCDEF',
      '$1': '2000000000000100',
      '$2': '0000000000000002',
    },
    {
      '2000000000000100': '89',
      '2000000000000101': 'AB',
      '2000000000000102': 'CD',
      '2000000000000103': 'EF',
    }
  ],
  [
    //STTU $0, $1, $2 with positive overflow and misaligned address
    'AA000102',
    {
      '$0': '0000000123456789',
      '$1': '2000000000000100',
      '$2': '0000000000000003',
    },
    {
      '2000000000000100': '23',
      '2000000000000101': '45',
      '2000000000000102': '67',
      '2000000000000103': '89',
    }
  ],
  [
    //STTU $0, $1, $2 with negative overflow and misaligned address
    'AA000102',
    {
      '$0': '8000000087654321',
      '$1': '2000000000000100',
      '$2': '0000000000000005',
    },
    {
      '2000000000000104': '87',
      '2000000000000105': '65',
      '2000000000000106': '43',
      '2000000000000107': '21',
    }
  ]
];

exports.STTUI = [
  [
    //STTUI $0, $1, 04 with positive signed tetra
    'AB000104',
    {
      '$0': '0000000001234567',
      '$1': '2000000000000100',
    },
    {
      '2000000000000104': '01',
      '2000000000000105': '23',
      '2000000000000106': '45',
      '2000000000000107': '67',
    }
  ],
  [
    //STTUI $0, $1, 02 with negative signed tetra and misaligned address
    'AB000102',
    {
      '$0': 'FFFFFFFF89ABCDEF',
      '$1': '2000000000000100',
    },
    {
      '2000000000000100': '89',
      '2000000000000101': 'AB',
      '2000000000000102': 'CD',
      '2000000000000103': 'EF',
    }
  ],
  [
    //STTUI $0, $1, 03 with positive overflow and misaligned address
    'AB000103',
    {
      '$0': '0000000123456789',
      '$1': '2000000000000100',
    },
    {
      '2000000000000100': '23',
      '2000000000000101': '45',
      '2000000000000102': '67',
      '2000000000000103': '89',
    }
  ],
  [
    //STTUI $0, $1, 05 with negative overflow and misaligned address
    'AB000105',
    {
      '$0': '8000000087654321',
      '$1': '2000000000000100',
    },
    {
      '2000000000000104': '87',
      '2000000000000105': '65',
      '2000000000000106': '43',
      '2000000000000107': '21',
    }
  ]
];

exports.STO = [
  [
    //ST0 $0, $1, $2 with positive signed octa and misaligned address
    'AC000102',
    {
      '$0': '0123456789ABCDEF',
      '$1': '2000000000000100',
      '$2': '0000000000000004',
    },
    {
      '2000000000000100': '01',
      '2000000000000101': '23',
      '2000000000000102': '45',
      '2000000000000103': '67',
      '2000000000000104': '89',
      '2000000000000105': 'AB',
      '2000000000000106': 'CD',
      '2000000000000107': 'EF',
    }
  ],
  [
    //STO $0, $1, $2 with negative signed octa and misaligned address
    'AC000102',
    {
      '$0': 'FFFFFFFF89ABCDEF',
      '$1': '2000000000000100',
      '$2': '0000000000000007',
    },
    {
      '2000000000000100': 'FF',
      '2000000000000101': 'FF',
      '2000000000000102': 'FF',
      '2000000000000103': 'FF',
      '2000000000000104': '89',
      '2000000000000105': 'AB',
      '2000000000000106': 'CD',
      '2000000000000107': 'EF',
    }
  ]
];

exports.STOI = [
  [
    //STOI $0, $1, 02 with positive signed octa and misaligned address
    'AD000102',
    {
      '$0': '0123456789ABCDEF',
      '$1': '2000000000000100',
    },
    {
      '2000000000000100': '01',
      '2000000000000101': '23',
      '2000000000000102': '45',
      '2000000000000103': '67',
      '2000000000000104': '89',
      '2000000000000105': 'AB',
      '2000000000000106': 'CD',
      '2000000000000107': 'EF',
    }
  ],
  [
    //STOI $0, $1, 07 with negative signed octa and misaligned address
    'AD000107',
    {
      '$0': 'FFFFFFFF89ABCDEF',
      '$1': '2000000000000100',
    },
    {
      '2000000000000100': 'FF',
      '2000000000000101': 'FF',
      '2000000000000102': 'FF',
      '2000000000000103': 'FF',
      '2000000000000104': '89',
      '2000000000000105': 'AB',
      '2000000000000106': 'CD',
      '2000000000000107': 'EF',
    }
  ]
];

exports.STOU = [
  [
    //STOU $0, $1, $2 with positive signed octa and misaligned address
    'AE000102',
    {
      '$0': '0123456789ABCDEF',
      '$1': '2000000000000100',
      '$2': '0000000000000004',
    },
    {
      '2000000000000100': '01',
      '2000000000000101': '23',
      '2000000000000102': '45',
      '2000000000000103': '67',
      '2000000000000104': '89',
      '2000000000000105': 'AB',
      '2000000000000106': 'CD',
      '2000000000000107': 'EF',
    }
  ],
  [
    //STOU $0, $1, $2 with negative signed octa and misaligned address
    'AE000102',
    {
      '$0': 'FFFFFFFF89ABCDEF',
      '$1': '2000000000000100',
      '$2': '0000000000000007',
    },
    {
      '2000000000000100': 'FF',
      '2000000000000101': 'FF',
      '2000000000000102': 'FF',
      '2000000000000103': 'FF',
      '2000000000000104': '89',
      '2000000000000105': 'AB',
      '2000000000000106': 'CD',
      '2000000000000107': 'EF',
    }
  ]
];

exports.STOUI = [
  [
    //STOUI $0, $1, 02 with positive signed octa and misaligned address
    'AF000102',
    {
      '$0': '0123456789ABCDEF',
      '$1': '2000000000000100',
    },
    {
      '2000000000000100': '01',
      '2000000000000101': '23',
      '2000000000000102': '45',
      '2000000000000103': '67',
      '2000000000000104': '89',
      '2000000000000105': 'AB',
      '2000000000000106': 'CD',
      '2000000000000107': 'EF',
    }
  ],
  [
    //STOUI $0, $1, 07 with negative signed octa and misaligned address
    'AF000107',
    {
      '$0': 'FFFFFFFF89ABCDEF',
      '$1': '2000000000000100',
    },
    {
      '2000000000000100': 'FF',
      '2000000000000101': 'FF',
      '2000000000000102': 'FF',
      '2000000000000103': 'FF',
      '2000000000000104': '89',
      '2000000000000105': 'AB',
      '2000000000000106': 'CD',
      '2000000000000107': 'EF',
    }
  ]
];

exports.STHT = [
  [
    //STHT $0, $1, $2
    'B2000102',
    {
      '$0': '0123456789ABCDEF',
      '$1': '2000000000000100',
      '$2': '0000000000000001',
    },
    {
      '2000000000000100': '01',
      '2000000000000101': '23',
      '2000000000000102': '45',
      '2000000000000103': '67',
    }
  ]
];

exports.STHTI = [
  [
    //STHTI $0, $1, 05
    'B3000105',
    {
      '$0': 'FFFFFFFF00000000',
      '$1': '2000000000000100',
    },
    {
      '2000000000000104': 'FF',
      '2000000000000105': 'FF',
      '2000000000000106': 'FF',
      '2000000000000107': 'FF',
    }
  ],
];

exports.STCO = [
  [
    //STCO FF, $1, $2
    'B4FF0102',
    {
      '$1': '2000000000000100',
      '$2': '0000000000000001',
    },
    {
      '2000000000000100': '00',
      '2000000000000101': '00',
      '2000000000000102': '00',
      '2000000000000103': '00',
      '2000000000000104': '00',
      '2000000000000105': '00',
      '2000000000000106': '00',
      '2000000000000107': 'FF',
    }
  ]
];

exports.STCOI = [
  [
    //STCOI 77, $1, $2
    'B5770102',
    {
      '$1': '2000000000000100',
    },
    {
      '2000000000000100': '00',
      '2000000000000101': '00',
      '2000000000000102': '00',
      '2000000000000103': '00',
      '2000000000000104': '00',
      '2000000000000105': '00',
      '2000000000000106': '00',
      '2000000000000107': '77',
    }
  ]
];
