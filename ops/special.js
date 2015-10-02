var _ = require('../utils');
var special = {
  '00': 'rB',
  '01': 'rD',
  '02': 'rE',
  '03': 'rH',
  '04': 'rJ',
  '05': 'rM',
  '06': 'rR',
  '07': 'rBB',
  '08': 'rC',
  '09': 'rN',
  '0A': 'rO',
  '0B': 'rS',
  '0C': 'rI',
  '0D': 'rT',
  '0E': 'rTT',
  '0F': 'rK',
  '10': 'rQ',
  '11': 'rU',
  '12': 'rV',
  '13': 'rG',
  '14': 'rL',
  '15': 'rA',
  '16': 'rF',
  '17': 'rP',
  '18': 'rW',
  '19': 'rX',
  '1A': 'rY',
  '1B': 'rZ',
  '1C': 'rWW',
  '1D': 'rXX',
  '1E': 'rYY',
  '1F': 'rZZ'
};

/**
 * Get from special register.
 * @param {State} state
 * @param {Hex} X - destination register
 * @param {Hex} Y - must be zero
 * @param {Hex} Z - immediate byte constant - the code for the special register
 */
exports.GET = function(state, X, Y, Z) {
  var key = special[Z];
  var contents = _.specialRegOcta(key, state);

  return _.build(
    _.genRegKey(X),
    contents
  );
};

/**
 * Put into special register.
 * @param {State} state
 * @param {Hex} X - immediate byte constant - the code for the special register
 * @param {Hex} Y - must be zero
 * @param {Hex} Z - source register
 * @return {Diff}
 */
exports.PUT = function(state, X, Y, Z) {
  return _.build(
    special[X],
    _.genRegOcta(Z, state)
  );
  //TODO illegal PUT commands should cause an illegal instruction interrupt or a
  //privileged operation interrupt
};

/**
 * Put into special register immediate.
 * @param {State} state
 * @param {Hex} X - immediate byte constant - the code for the special register
 * @param {Hex} Y - must be zero
 * @param {Hex} Z - immediate byte constant
 * @return {Diff}
 */
exports.PUTI = function(state, X, Y, Z) {
  return _.build(
    special[X],
    _.extendUnsignedTo64(Z)
  );
};

/**
 * Save process state.
 */
exports.SAVE = function(state, X, Y, Z) {
  throw new Error('SAVE not implemented');
};

/**
 * Restore process state.
 */
exports.UNSAVE = function(state, X, Y, Z) {
  throw new Error('UNSAVE not implemented');
};
