var _ = require('./utils');

/**
 * Push registers and jump.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - left byte of immediate wyde constant
 * @param {Hex} Z - right byte of immediate wyde constant
 * @return {Diff}
 */
exports.PUSHJ = function(state, X, Y, Z) {
  //"$4" => 4
  var x = _.hexToUint64(X.substring(1));
  var l = _.specialToUint64('rL', state);
  var g = _.specialToUint64('rG', state);

  if (x.compare(rL)) {
    return _.build(
      _.genRegKey(X), x,
      'rJ', _.step(state),
      '@', _.RA(YZ, state),
      'rL', _.uint64ToOcta(l.minus(x).minus(1))
    );
  }
};

exports.PUSHGO = function(state, X, Y, Z) {

};
