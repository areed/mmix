/**
 * @param {Array} instructions
 */
MMIX.prototype.loadProgram = function(instructions) {
  var start = new Big(256);
  var memory = this.memory;

  //TODO don't mutate instructions array
  if (instructions[instructions.length - 1] !== '00000000') {
    instructions.push('00000000');
  }

  instructions.forEach(function(instruct, index) {
    memory.setTetra(instruct, start.plus(index * 4));
  });

  return start;
};

/**
 * @param {Object} address - type Big.js address of first instruction
 */
MMIX.prototype.run = function(address) {
  this.at = address.minus(4);
  this.counts = {};
  var self = this;

  var s = highland(function(push, next) {
    var at = self.jumpTarget || self.at.plus(4);
    self.at = at;
    self.jumpTarget = null;
    self.counts[Memory.addressKey(at)] = (self.counts[Memory.addressKey(at)] || 0) + 1;
    var tetra = self.memory.getTetra(at);
    if (tetra === '00000000') {
      push(null, highland.nil);
      return;
    }
    push(null, tetra);
    next();
  });

  return s
    .map(disassemble)
    .doto(function(instruction) {
      self[instruction[0]].apply(self, instruction.slice(1));
    });
};

/**
 *
 */
MMIX.prototype.costs = function() {
  var costs = {};
  for (var a in this.counts) {
    if (this.counts.hasOwnProperty(a)) {
      var op = this.memory.store[a];
      var cost = opcodes.costs[op];
      var count = this.counts[a];
      costs[a] = {oops: cost.oops * count, mems: cost.mems * count};
    }
  }
  return costs;
};

module.exports = MMIX;
