exports.SL = [
  [
    '38010203',
    {
      $2: '0000000000000000',
      $3: '0000000000000000',
    }, {
      $1: '0000000000000000',
    }
  ],
  [
    '38010203',
    {
      $2: '0000000000000000',
      $3: '0000000000000001',
    }, {
      $1: '0000000000000000',
    }
  ],
  [
    '38010203',
    {
      $2: '0000000000000001',
      $3: '0000000000000000',
    }, {
      $1: '0000000000000001',
    }
  ],
  [
    '38010203',
    {
      $2: '00000000FFFFFFFF',
      $3: '0000000000000010',
    },
    {
      $1: '0000FFFFFFFF0000',
    }
  ],
  [
    '38010203',
    {
      $2: 'FFFFFFFF00000000',
      $3: '0000000000000004',
    },
    {
      $1: 'FFFFFFF000000000',
    }
  ],
  [
    '38010203',
    {
      $2: '7000000000000000',
      $3: '0000000000000007',
    },
    {
      $1: '0000000000000000',
      'exceptions': '01000000',
    }
  ],
];

exports.SLI = [
  [
    '39010200',
    {
      $2: '0000000000000000',
    }, {
      $1: '0000000000000000',
    }
  ],
  [
    '39010201',
    {
      $2: '0000000000000000',
    }, {
      $1: '0000000000000000',
    }
  ],
  [
    '39010200',
    {
      $2: '0000000000000001',
    }, {
      $1: '0000000000000001',
    }
  ],
  [
    '39010210',
    {
      $2: '00000000FFFFFFFF',
    },
    {
      $1: '0000FFFFFFFF0000',
    }
  ],
  [
    '39010204',
    {
      $2: 'FFFFFFFF00000000',
    },
    {
      $1: 'FFFFFFF000000000',
    }
  ],
  [
    '39010207',
    {
      $2: '7000000000000000',
    },
    {
      $1: '0000000000000000',
      'exceptions': '01000000',
    }
  ],
];

exports.SLU = [
  [
    '3A010203',
    {
      $2: '0000000000000000',
      $3: '0000000000000000',
    }, {
      $1: '0000000000000000',
    }
  ],
  [
    '3A010203',
    {
      $2: '0000000000000000',
      $3: '0000000000000001',
    }, {
      $1: '0000000000000000',
    }
  ],
  [
    '3A010203',
    {
      $2: '0000000000000001',
      $3: '0000000000000000',
    }, {
      $1: '0000000000000001',
    }
  ],
  [
    '3A010203',
    {
      $2: '00000000FFFFFFFF',
      $3: '0000000000000010',
    },
    {
      $1: '0000FFFFFFFF0000',
    }
  ],
  [
    '3A010203',
    {
      $2: 'FFFFFFFF00000000',
      $3: '0000000000000004',
    },
    {
      $1: 'FFFFFFF000000000',
    }
  ],
  [
    '3A010203',
    {
      $2: '7000000000000000',
      $3: '0000000000000007',
    },
    {
      $1: '0000000000000000',
    }
  ],
];

exports.SLUI = [
  [
    '3B010200',
    {
      $2: '0000000000000000',
    }, {
      $1: '0000000000000000',
    }
  ],
  [
    '3B010201',
    {
      $2: '0000000000000000',
    }, {
      $1: '0000000000000000',
    }
  ],
  [
    '3B010200',
    {
      $2: '0000000000000001',
    }, {
      $1: '0000000000000001',
    }
  ],
  [
    '3B010210',
    {
      $2: '00000000FFFFFFFF',
    },
    {
      $1: '0000FFFFFFFF0000',
    }
  ],
  [
    '3B010204',
    {
      $2: 'FFFFFFFF00000000',
    },
    {
      $1: 'FFFFFFF000000000',
    }
  ],
  [
    '3B010207',
    {
      $2: '7000000000000000',
    },
    {
      $1: '0000000000000000',
    }
  ],
];

exports.SR = [
  ['3C000102', {
    '$1': '0000000000000000',
    '$2': '0000000000000000',
  }, {
    '$0': '0000000000000000',
  }],
  ['3C000102', {
    '$1': '1000000000000000',
    '$2': '0000000000000000',
  }, {
    '$0': '1000000000000000',
  }],
  ['3C000102', {
    '$1': '1000000000000000',
    '$2': '0000000000000001',
  }, {
    '$0': '0800000000000000',
  }],
  ['3C000102', {
    '$1': '0000000000000008',
    '$2': '0000000000000001',
  }, {
    '$0': '0000000000000004',
  }],
  ['3C000102', {
    '$1': '1111111111111111',
    '$2': '0000000000000020',
  }, {
    '$0': '0000000011111111',
  }],
  ['3C000102', {
    '$1': 'F000000000000000',
    '$2': '0000000000000040',
  }, {
    '$0': 'FFFFFFFFFFFFFFFF',
  }],
  ['3C000102', {
    '$1': '8000000000000000',
    '$2': '0000000000000004',
  }, {
    '$0': 'F800000000000000',
  }],
];

exports.SRI = [
  ['3D000100', {
    '$1': '0000000000000000',
  }, {
    '$0': '0000000000000000',
  }],
  ['3D000100', {
    '$1': '1000000000000000',
  }, {
    '$0': '1000000000000000',
  }],
  ['3D000101', {
    '$1': '1000000000000000',
  }, {
    '$0': '0800000000000000',
  }],
  ['3D000101', {
    '$1': '0000000000000008',
  }, {
    '$0': '0000000000000004',
  }],
  ['3D000120', {
    '$1': '1111111111111111',
  }, {
    '$0': '0000000011111111',
  }],
  ['3D000140', {
    '$1': 'F000000000000000',
  }, {
    '$0': 'FFFFFFFFFFFFFFFF',
  }],
  ['3D000104', {
    '$1': '8000000000000000',
  }, {
    '$0': 'F800000000000000',
  }],
];

exports.SRU = [
  ['3E000102', {
    '$1': '0000000000000000',
    '$2': '0000000000000000',
  }, {
    '$0': '0000000000000000',
  }],
  ['3E000102', {
    '$1': '1000000000000000',
    '$2': '0000000000000000',
  }, {
    '$0': '1000000000000000',
  }],
  ['3E000102', {
    '$1': '1000000000000000',
    '$2': '0000000000000001',
  }, {
    '$0': '0800000000000000',
  }],
  ['3E000102', {
    '$1': '0000000000000008',
    '$2': '0000000000000001',
  }, {
    '$0': '0000000000000004',
  }],
  ['3E000102', {
    '$1': '1111111111111111',
    '$2': '0000000000000020',
  }, {
    '$0': '0000000011111111',
  }],
  ['3E000102', {
    '$1': 'F000000000000000',
    '$2': '0000000000000040',
  }, {
    '$0': '0000000000000000',
  }],
  ['3E000102', {
    '$1': '8000000000000000',
    '$2': '0000000000000004',
  }, {
    '$0': '0800000000000000',
  }],
];

exports.SRUI = [
  ['3F000100', {
    '$1': '0000000000000000',
  }, {
    '$0': '0000000000000000',
  }],
  ['3F000100', {
    '$1': '1000000000000000',
  }, {
    '$0': '1000000000000000',
  }],
  ['3F000101', {
    '$1': '1000000000000000',
  }, {
    '$0': '0800000000000000',
  }],
  ['3F000101', {
    '$1': '0000000000000008',
  }, {
    '$0': '0000000000000004',
  }],
  ['3F000120', {
    '$1': '1111111111111111',
  }, {
    '$0': '0000000011111111',
  }],
  ['3F000140', {
    '$1': 'F000000000000000',
  }, {
    '$0': '0000000000000000',
  }],
  ['3F000104', {
    '$1': '8000000000000000',
  }, {
    '$0': '0800000000000000',
  }],
];
