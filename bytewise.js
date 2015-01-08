var _ = require('./utils');

var parseHex = function(h) {
  return parseInt(h.join(''), 16);
};

/**
 * Byte difference.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.BDIF = function(state, X, Y, Z) {
  var y = _.genRegOcta(Y, state);
  var z = _.genRegOcta(Z, state);

  var yBytes = _.chunk(2, y.split('')).map(parseHex);
  var zBytes = _.chunk(2, z.split('')).map(parseHex);

  var answer = yBytes.map(function(b, j) {
    return Math.max(0, b - zBytes[j]);
  });

  return _.build(_.genRegKey(X), answer.map(_.hexifyByte).join(''));
};

/**
 * Byte difference immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.BDIFI = function(state, X, Y, Z) {
  var y = _.genRegOcta(Y, state);
  var z = _.extendUnsignedTo64(Z);

  var yBytes = _.chunk(2, y.split('')).map(parseHex);
  var zBytes = _.chunk(2, z.split('')).map(parseHex);

  var answer = yBytes.map(function(b, j) {
    return Math.max(0, b - zBytes[j]);
  });

  return _.build(_.genRegKey(X), answer.map(_.hexifyByte).join(''));
};

/**
 * Wyde difference.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.WDIF = function(state, X, Y, Z) {
  var y = _.genRegOcta(Y, state);
  var z = _.genRegOcta(Z, state);

  var yWydes = _.chunk(4, y.split('')).map(parseHex);
  var zWydes = _.chunk(4, z.split('')).map(parseHex);

  var answer = yWdyes.map(function(b, j) {
    return Math.max(0, b - zWydes[j]);
  });

  return _.build(_.genRegKey(X), answer.map(_.hexifyByte).join(''));
};


/**
 * Wyde difference immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.WDIFI = function(state, X, Y, Z) {
  var y = _.genRegOcta(Y, state);
  var z = _.extendUnsignedTo64(Z);

  var yWydes = _.chunk(4, y.split('')).map(parseHex);
  var zWydes = _.chunk(4, z.split('')).map(parseHex);

  var answer = yWydes.map(function(b, j) {
    return Math.max(0, b - zWydes[j]);
  });

  return _.build(_.genRegKey(X), answer.map(_.hexifyByte).join(''));
};

/**
 * Tetra difference.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.TDIF = function(state, X, Y, Z) {
  var y = _.genRegOcta(Y, state);
  var z = _.genRegOcta(Z, state);

  var yTetras = _.chunk(8, y.split('')).map(parseHex);
  var zTetras = _.chunk(8, z.split('')).map(parseHex);

  var answer = yTetras.map(function(b, j) {
    return Math.max(0, b - zTetras[j]);
  });

  return _.build(_.genRegKey(X), answer.map(_.hexifyByte).join(''));
};

/**
 * Tetra difference immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.TDIFI = function(state, X, Y, Z) {
  var y = _.genRegOcta(Y, state);
  var z = _.extendUnsignedTo64(Z);

  var yTetras = _.chunk(8, y.split('')).map(parseHex);
  var zTetras = _.chunk(8, z.split('')).map(parseHex);

  var answer = yTetras.map(function(b, j) {
    return Math.max(0, b - zTetras[j]);
  });

  return _.build(_.genRegKey(X), answer.map(_.hexifyByte).join(''));
};

/**
 * Octa difference.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.ODIF = function(state, X, Y, Z) {
  var y = _.regToUint64(Y, state);
  var z = _.regToUint64(Z, state);
  var answer = y.subtract(z);

  return _.build(
    _.genRegKey(X),
    y.compare(z) === 1 ? y.subtract(z) : _.ZEROS
  );
};

/**
 * Octa difference immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.ODIFI = function(state, X, Y, Z) {
  var y = _.regToUint64(Y, state);
  var z = _.byteToUint64(Z, state);
  var answer = y.subtract(z);

  return _.build(
    _.genRegKey(X),
    y.compare(z) === 1 ? y.subtract(z) : _.ZEROS
  );
};

/**
 * Sideways add. Counts the number of bit positions in which register $Y has a 1
 * while register $Z has a 0.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.SADD = function(state, X, Y, Z) {
  var y = _.regToUint64(Y, state);
  var z = _.regToUint64(Z, state);
  var x = y
    .and(z.not())
    .toString(2)
    .toUpperCase()
    .split('')
    .reduce(function(n, m) {
      return n + parseInt(m, 10);
    }, 0);

  return _.build(
    _.genRegKey(X),
    _.hexify64(x + '')
  );
};    

/**
 * Sideways add immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.SADDI = function(state, X, Y, Z) {
  var y = _.regToUint64(Y, state);
  var z = _.byteToUint64(Z, state);
  var x = y
    .and(z.not())
    .toString(2)
    .toUpperCase()
    .split('')
    .reduce(function(n, m) {
      return n + parseInt(m, 10);
    }, 0);

  return _.build(
    _.genRegKey(X),
    _.hexify64(x + '')
  );
};

/**
 * Multiple or.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {hex} Z - source register
 * @return {Diff}
 */
exports.MOR = function(state, X, Y, Z) {
  var y = _.matrix(_.genRegOcta(Y, state));
  var z = _.matrix(_.genRegOcta(Z, state));
  var C = _.reducePairedVectors(_.times, _.reducePairs(_.or, _.pairs(y, z)));

  return _.build(
    _.genRegKey(X),
    _.binaryToHex(_.matrixToBits(C))
  );
};

/**
 * Multiple or immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.MORI = function(state, X, Y, Z) {
  var y = _.matrix(_.genRegOcta(Y, state));
  var z = _.matrix(_.extendUnsignedTo64(Z));
  var C = _.reducePairedVectors(_.times, _.reducePairs(_.or, _.pairs(y, z)));

  return _.build(
    _.genRegKey(X),
    _.binaryToHex(_.matrixToBits(C))
  );
};

/**
 * Multiple xor.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {hex} Z - source register
 * @return {Diff}
 */
exports.MXOR = function(state, X, Y, Z) {
  var y = _.matrix(_.genRegOcta(Y, state));
  var z = _.matrix(_.genRegOcta(Z, state));
  var C = _.reducePairedVectors(_.times, _.reducePairs(_.xor, _.pairs(y, z)));

  return _.build(
    _.genRegKey(X),
    _.binaryToHex(_.matrixToBits(C))
  );
};

/**
 * Multiple xor immediate.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - source register
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.MXORI = function(state, X, Y, Z) {
  var y = _.matrix(_.genRegOcta(Y, state));
  var z = _.matrix(_.extendUnsignedTo64(Z));
  var C = _.reducePairedVectors(_.times, _.reducePairs(_.xor, _.pairs(y, z)));

  return _.build(
    _.genRegKey(X),
    _.binaryToHex(_.matrixToBits(C))
  );
};
