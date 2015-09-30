var _ = require('../utils');

/**
 * Push registers and jump.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - left byte of immediate wyde constant
 * @param {Hex} Z - right byte of immediate wyde constant
 * @return {Diff}
 */
exports.PUSHJ = function(state, X, Y, Z) {
  var x = _.byteToUint64(X);
  var l = _.specialToUint64('rL', state);
  var g = _.specialToUint64('rG', state);
  var rO = _.specialToUint64('rO', state);
  var x1 = x.add(1);

  if (x.compare(l) === -1) {
    return _.build(
      _.genRegKey(X), _.extendUnsignedTo64(X),
      'rJ', _.step(state),
      '@', _.RA(Y + Z, state),
      'rL', _.uint64ToOcta(l.subtract(x1)),
      'rO', _.uint64ToOcta(rO.add(x1.multiply(8)))
    );
  }
  if (x.compare(g) >= 0) {
    return _.build(
      '$' + l.toString(), _.uint64ToOcta(l),
      'rJ', _.step(state),
      '@', _.RA(Y + Z, state),
      'rL', _.ZEROS,
      'rO', _.uint64ToOcta(rO.add(l.add(1).multiply(8)))
    );
  }
  //X is marginal same as local but L first increases to X + 1
  return _.build(
    _.genRegKey(X), _.extendUnsignedTo64(X),
    'rJ', _.step(state),
    '@', _.RA(Y + Z, state),
    'rL', _.ZEROS,
    'rO', _.uint64ToOcta(rO.add(x1.multiply(8)))
  );
};

/**
 * Push registers and jump back.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - left byte of immediate wyde constant
 * @param {Hex} Z - right byte of immediate wyde constant
 * @return {Diff}
 */
exports.PUSHJB = function(state, X, Y, Z) {
  var x = _.byteToUint64(X);
  var l = _.specialToUint64('rL', state);
  var g = _.specialToUint64('rG', state);
  var rO = _.specialToUint64('rO', state);
  var x1 = x.add(1);

  if (x.compare(l) === -1) {
    return _.build(
      _.genRegKey(X), _.extendUnsignedTo64(X),
      'rJ', _.step(state),
      '@', _.jumpBackWyde(state, Y + Z),
      'rL', _.uint64ToOcta(l.subtract(x1)),
      'rO', _.uint64ToOcta(rO.add(x1.multiply(8)))
    );
  }
  if (x.compare(g) >= 0) {
    return _.build(
      '$' + l.toString(), _.uint64ToOcta(l),
      'rJ', _.step(state),
      '@', _.jumpBackWyde(state, Y + Z),
      'rL', _.ZEROS,
      'rO', _.uint64ToOcta(rO.add(l.add(1).multiply(8)))
    );
  }
  //X is marginal same as local but L first increases to X + 1
  return _.build(
    _.genRegKey(X), _.extendUnsignedTo64(X),
    'rJ', _.step(state),
    '@', _.jumpBackWyde(state, Y + Z),
    'rL', _.ZEROS,
    'rO', _.uint64ToOcta(rO.add(x1.multiply(8)))
  );
};

/**
 * Push registers and go.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - left byte of immediate wyde constant
 * @param {Hex} Z - right byte of immediate wyde constant
 * @return {Diff}
 */
exports.PUSHGO = function(state, X, Y, Z) {
  var x = _.byteToUint64(X);
  var l = _.specialToUint64('rL', state);
  var g = _.specialToUint64('rG', state);
  var rO = _.specialToUint64('rO', state);
  var x1 = x.add(1);

  if (x.compare(l) === -1) {
    return _.build(
      _.genRegKey(X), _.extendUnsignedTo64(X),
      'rJ', _.step(state),
      '@', _.A(state, Y, Z),
      'rL', _.uint64ToOcta(l.subtract(x1)),
      'rO', _.uint64ToOcta(rO.add(x1.multiply(8)))
    );
  }
  if (x.compare(g) >= 0) {
    return _.build(
      '$' + l.toString(), _.uint64ToOcta(l),
      'rJ', _.step(state),
      '@', _.A(state, Y, Z),
      'rL', _.ZEROS,
      'rO', _.uint64ToOcta(rO.add(l.add(1).multiply(8)))
    );
  }
  //X is marginal same as local but L first increases to X + 1
  return _.build(
    _.genRegKey(X), _.extendUnsignedTo64(X),
    'rJ', _.step(state),
    '@', _.A(state, Y, Z),
    'rL', _.ZEROS,
    'rO', _.uint64ToOcta(rO.add(x1.multiply(8)))
  );
};

/**
 * Push registers and go immediate..
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - left byte of immediate wyde constant
 * @param {Hex} Z - right byte of immediate wyde constant
 * @return {Diff}
 */
exports.PUSHGOI = function(state, X, Y, Z) {
  var x = _.byteToUint64(X);
  var l = _.specialToUint64('rL', state);
  var g = _.specialToUint64('rG', state);
  var rO = _.specialToUint64('rO', state);
  var x1 = x.add(1);

  if (x.compare(l) === -1) {
    return _.build(
      _.genRegKey(X), _.extendUnsignedTo64(X),
      'rJ', _.step(state),
      '@', _.AI(state, Y, Z),
      'rL', _.uint64ToOcta(l.subtract(x1)),
      'rO', _.uint64ToOcta(rO.add(x1.multiply(8)))
    );
  }
  if (x.compare(g) >= 0) {
    return _.build(
      '$' + l.toString(), _.uint64ToOcta(l),
      'rJ', _.step(state),
      '@', _.AI(state, Y, Z),
      'rL', _.ZEROS,
      'rO', _.uint64ToOcta(rO.add(l.add(1).multiply(8)))
    );
  }
  //X is marginal same as local but L first increases to X + 1
  return _.build(
    _.genRegKey(X), _.extendUnsignedTo64(X),
    'rJ', _.step(state),
    '@', _.AI(state, Y, Z),
    'rL', _.ZEROS,
    'rO', _.uint64ToOcta(rO.add(x1.multiply(8)))
  );
};
