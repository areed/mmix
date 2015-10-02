var Long = require('long');
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

/**
 * Return from a subroutine and restore state of the caller.
 * @param {State} state
 * @param {Hex} X - immediate bye constant - how many local registers to
 * preserve
 * @param {Hex} Y - left byte of immediate wyde constant
 * @param {Hex} Z - right byte of immediate wyde constant
 * @return {Diff}
 */
exports.POP =  function(state, X, Y, Z) {
  var x = parseInt(X, 16);
  var l = parseInt(state.special.rL, 16);
  var g = parseInt(state.special.rG, 16);
  var rJ = _.specialToUint64('rJ', state);
  var YZ = parseInt(Y + Z, 16);
  //the X value in the push instruction that is being undone
  var pushX = state.S(state.tau - 1);
  //decrease alpha by setting rO
  var rO = _.specialToUint64('rO', state);
  var rS = _.specialToUint64('rS', state);
  var rOnext = rO.subtract(Long.fromString(pushX, true, 16).add(1).multiply(8));

  if (rOnext.compare(rS) < 0) {
    throw new Error('decreasing rS/gamma not implemented; stack is too large');
  }
  if (x > g) {
    throw new Error('POP globals not implemented');
  }

  if (x > l) {
    x = l + 1;
  }
  //fill the hole with the highest register; if this subroutine was called with
  //PUSH 8 YZ and we're returning 5 values, $4 is moved to $-1, which is $8 to
  //the caller
  var $hole = _.genRegKey(pushX.substring(14));
  var hole = _.genRegOcta((x - 1).toString(16), state);

  return _.build(
    '@', _.uint64ToOcta(rJ.add(4 * YZ)),
    $hole, x <= l ? hole : 0,
    'rL', _.extendUnsignedTo64(Math.min(x + parseInt(pushX, 16), g).toString(16)),
    'rO', _.uint64ToOcta(rOnext)
  );
};
