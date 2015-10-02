/** @module MMIX */
var lodash = require('lodash');
var _ = require('./utils');
var Memory = require('./memory');
var ops = require('./ops');

/**
 * @constructor
 * @alias module:MMIX
 * @param {Uint32Array} program - bytecode instructions
 */
function MMIX(program) {
  this.memory = new Memory();
  this.memory.text = program || this.memory.text;
  this.internal = _.internals();

  //every step of the program generates a diff that can be applied to the
  //current machine state to get the new machine state
  this.diffs = [];
  //keep track of the state that was changed with each diff so it will be
  //possible to step backwards through the program too
  this.changes = [];
  this.costs = [];

  //The special registers and the global general registers are stored in a
  //single register file because there are exactly 32 special registers and G is
  //at least 32. The leftmost 64 items in the file store the special registers
  //(2 consecutive int32 items per 64 bit register) and the rightmost 448
  //positions are available for global registers.
  var nonLocalRegisterFile = new Uint32Array(256 * 2);
  //Local registers are stored in the local register stack file. See §42 of
  //mmix-doc.pdf for details. It's a cyclic array backed by stack segment
  //memory.
  var localRegisterFile = new Uint32Array(512 * 2);

  //The two register banks above are implementation level details. The MMIX
  //machine interface exposes 256 general and 32 special registers to the
  //programmer.
  var general = this.general = {};
  var special = this.special = {};

  //define each general register as an accessor property on the general object
  lodash.range(256).forEach(function(i) {
    Object.defineProperty(general, '$' + i, {
      enumerable: true,
      get: function() {
        //cheating a bit here using the low int32 only from the special
        //registers, but I think that covers any values needed for the stack
        //calculations
        var rG = nonLocalRegisterFile[39];
        var rL = nonLocalRegisterFile[41];
        var rO = nonLocalRegisterFile[21];

        //if this is a global register lookup the value in the global register
        //file
        if (i >= rG) {
          return read(nonLocalRegisterFile, i);
        }

        //if this is a marginal register return 0
        if (rL <= i) {
          return _.ZEROS;
        }

        //must be a local register so calculate where to find it in the
        //local register file
        //α = (rO/8) mod 512
        var alpha = (rO / 8) % 512;
        var key = (alpha + i) % 512;

        return read(localRegisterFile, key);
      },
      //when a marginal register is set rL should have already been set to its
      //new value, so this method should never be called on a marginal register
      //TODO consider implementation where rL set is triggered here
      set: function(hex) {
        if (typeof hex !== 'string' || hex.length !== 16) {
          throw new Error(['Register', i, 'requires 16 hex charcaters, got', hex].join(' '));
        }
        var rG = nonLocalRegisterFile[39];
        var rL = nonLocalRegisterFile[41];
        var rO = nonLocalRegisterFile[21];
        var high = parseInt(hex.substring(0, 8), 16);
        var low = parseInt(hex.substring(8), 16);

        //set global register
        if (i >= rG) {
          nonLocalRegisterFile[i << 1] = high;
          nonLocalRegisterFile[(i << 1) + 1] = low;
          return;
        }

        //marginal
        if (rL <= i) {
          throw new Error("Cannot set marginal register");
        }

        //local
        var alpha = (rO / 8) % 512;
        var key = (alpha + i) % 512;

        localRegisterFile[key << 1] = high;
        localRegisterFile[(key << 1) + 1] = low;
      },
    });
  });

  //special registers are read and set just like global general registers except
  //their name needs to be mapped to their internal code first
  lodash.each([
    {key: 'rA', code: 21},
    {key: 'rB', code: 0},
    {key: 'rC', code: 8},
    {key: 'rD', code: 1},
    {key: 'rE', code: 2},
    {key: 'rF', code: 22},
    {key: 'rG', code: 19},
    {key: 'rH', code: 3},
    {key: 'rI', code: 12},
    {key: 'rJ', code: 4},
    {key: 'rK', code: 15},
    {key: 'rL', code: 20},
    {key: 'rM', code: 5},
    {key: 'rN', code: 9},
    {key: 'rO', code: 10},
    {key: 'rP', code: 23},
    {key: 'rQ', code: 16},
    {key: 'rR', code: 6},
    {key: 'rS', code: 11},
    {key: 'rT', code: 13},
    {key: 'rU', code: 17},
    {key: 'rV', code: 18},
    {key: 'rW', code: 24},
    {key: 'rX', code: 25},
    {key: 'rY', code: 26},
    {key: 'rZ', code: 27},
    {key: 'rBB', code: 7},
    {key: 'rTT', code: 14},
    {key: 'rWW', code: 28},
    {key: 'rXX', code: 29},
    {key: 'rYY', code: 30},
    {key: 'rZZ', code: 31},
  ], function(r) {
    var i = r.code << 1;

    Object.defineProperty(special, r.key, {
      enumerable: true,
      get: function() {
        return read(nonLocalRegisterFile, r.code);
      },
      set: function(hex) {
        nonLocalRegisterFile[i] = parseInt(hex.substring(0, 8), 16);
        nonLocalRegisterFile[i + 1] = parseInt(hex.substring(8), 16);
      },
    });
  });

  //tau
  Object.defineProperty(this, 'tau', {
    enumerable: true,
    get: function() {
      //assume stack memory always starts at #6000000000000000 and only the last
      //few bytes are relevant
      var rO = parseInt(special.rO.substring(8), 16);

      return rO / 8;
    },
  });

  //read from stack - this abstracts over the localRegisterFile and stack
  //segment memory
  this.S = function(tau) {
    //TODO read from memory when more than 512 local registers are used
    return read(localRegisterFile, tau);
  };

  //preset certain special registers
  special.rG = '0000000000000020'; //global registers start at 32
}

MMIX.prototype.next = function() {
  //@ has already been set to the instruction to execute here
  var index = parseInt(this.internal['@'], 16) / 4;
  var instruction = this.memory.text[index].toString(16).toUpperCase();
  var cost = ops.costs[instruction.substring(0,2)];
  var accmcost = lodash.last(this.costs) || {oops: 0, mems: 0};
  this.costs.push({
    oops: accmcost.oops + cost.oops,
    mems: accmcost.mems + cost.mems,
  });
  var diff = _.execute(instruction, this);
  var more = _.diffEffects(diff, this);
  var fulldiff = lodash.assign({}, diff, more);
  //lookup current value in machine before applying diff
  var changes = _.diffChanges(fulldiff, this);
  //rL may need to be set before the computation's diff to avoid setting a
  //marginal register so apply more first then diff
  _.applyDiff(more, this);
  _.applyDiff(diff, this);
  this.diffs.push(fulldiff);
  this.changes.push(changes);
  return fulldiff;
};

MMIX.prototype.prev = function() {
  this.costs.pop();
  this.diffs.pop();
  _.applyDiff(this.changes.pop(), this);
};

/**
 * Returns true if the program has terminated.
 * @return {Boolean}
 */
MMIX.prototype.isHalted = function() {
  var at = parseInt(this.internal['@'], 16) / 4;

  return at >= this.memory.text.length;
};

MMIX.prototype.cost = function() {
  return _.last(this.costs);
};

/**
 * Reads the high and low int32s from a Uint32Array ann concatenates them as hex
 * strings.
 * @param {Uint32Array} file
 * @param {String} key
 */
function read(file, key) {
  var high = file[key << 1].toString(16).toUpperCase();
  var low = file[(key << 1) + 1].toString(16).toUpperCase();

  //padding
  high = _.extendUnsignedTo64(high).substring(8);
  low = _.extendUnsignedTo64(low).substring(8);

  return high + low;
}

module.exports = MMIX;
