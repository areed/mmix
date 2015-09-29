var _ = require('../utils');

/**
 * Trips to a handler.
 * @param {State} state
 * @param {Hex} to - octabyte address
 * @return {Diff}
 */
var trip = exports.trip = function trip(state, to) {
  var tripper = _.atInstruction(state);
  var opDoesStore = _.opDoesStore(_.OP(tripper));

  return {
    rB: _.genRegOcta('FF', state), //$255
    $255: _.specialRegOcta('rJ', state),
    rW: _.atStep(state),
    rX: '80000000' + tripper,
    rY: opDoesStore ? _.A(state, _.Y(tripper), _.Z(tripper)) : _.genRegOcta(_.Y(tripper), state),
    rZ: opDoesStore ? _.genRegOcta(_.X(tripper), state) : _.genRegOcta(_.Z(tripper), state),
    '@': to || _.ZEROS,
  };
};

/**
 * @param {State} state
 * @param {Hex} X - a byte
 * @param {Hex} Y - a byte
 * @param {Hex} Z - a byte
 * @return {Diff}
 */
exports.TRIP = function TRIP(state, X, Y, Z) {
  return trip(state, _.ZEROS);
};

/**
 * Force a trap to the operating system.
 * @param {State} state
 * @param {Hex} X - a byte
 * @param {Hex} Y - a byte
 * @param {Hex} Z - a byte
 * @return {Diff}
 */
exports.TRAP = function TRAP(state, X, Y, Z) {
  //dynamic traps are not implemented
  var trapper = _.atInstruction(state);
  var opDoesStore = _.opDoesStore(_.OP(trapper));

  return {
    'rBB': state.$255,
    $255: state.rJ,
    'rXX': '8000000000' + X + Y + Z,
    'rYY': _.genRegOcta(Y),
    'rZZ': _.genRegOcta(Z),
    'rK': _.ZEROS,
    '@': state.rT,
  };
};

/**
 * Resume after interrupt.
 * @param {State} state
 * @param {Hex} X - must be zero
 * @param {Hex} Y - must be zero
 * @param {Hex} Z - a byte
 */
exports.RESUME = function RESUME(state, X, Y, Z) {
  var rW = _.specialRegOcta('rW', state);
  var rX = _.specialRegOcta('rX', state);
  var rY = _.specialRegOcta('rY', state);
  var rZ = _.specialRegOcta('rZ', state);

  if (Z === '00') {
    //if execution register is negative proceed to rW
    if (_.octaIsNegative(rX)) {
      var diff = {
        '@': rW,
      };

      return diff;

/*** nothing else below here in the RESUME op has been implemented ***/

    /*
     * ropcode 0 might be implemented by calling the operation here then
     * returning rW as @ in the diff, i.e. the inserted instruction is executed
     * immediately and the result is included with the RESUME operation's diff.
     *
     * ropcode 1 might be implemented by saving $Y and $Z somewhere hidden from
     * the programmer, then setting their values from rY and rZ, executing the
     * inserted instruction immediately and returning the result with this diff,
     * but not before restoring $Y and $Z.
     *
     * ropcode 2 might be implemented simply by including $X in the diff to this
     * RESUME operation from rZ, and exceptions from the third byte of rX.
     *
     * In all cases the cost of the inserted instruction would be ignored.
     */

    //execution register is nonnegative
    } else {
      //ropcode
      switch (rX.substring(0, 2)) {
      case '00':
        //simply inserts the instruction from the low tetra of rX into the
        //instruction stream
        break;
      case '01':
        //simliar to ropcode 0 but substitutes rY and rZ for the two
        //operands, assuming that this makes sense for the operation considered
        break;
      case '02':
        //inserts a command that sets $X to rZ, where X is the second byte in
        //the right half of rX. More details in MMIXware document
        break;
      case '03':
        //same as ropcode 0 except that it also tells MMIX to treat rZ as the
        //page table entry for the virtual address rY.
        //only RESUME 1 (OS code) is allowed to use ropcode 3
      }

      throw new Error('Resume when leading byte of rX is 0 is not implemented');
    }
  }

  //RESUME 1 is for operating system instructions only
  if (Z === '01') {

    if (_.octaIsNegative(state.rXX)) {
      //The implementation is same as above, but with rWW, rXX, rYY, and rZZ.
      //Also, just before resuming the computation, mask register rK is set to
      //$255 and $255 is set to rBB.
      //MMIXware document also specifies behavior of an OS interrupt handle that
      //allows itself to be interrupted.

    } else { //execution register is nonnegative
      //same as above and ropcode 3 is allowed
      switch (state.rXX.substring(0, 2)) {
      case '00':
        break;
      case '01':
        break;
      case '02':
        break;
      case '03':
      }
    }

    throw new Error('Resume with Z argument 1 not implemented.');
  }

  //Values of Z greater than 1 are reserved for possible later definition.
  //TODO set the 'b' bit of rQ instead of throwing an error
  throw new Error('Illegal instruction interrupt');
};
