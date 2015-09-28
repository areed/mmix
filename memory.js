var Long = require('long');

//default user space segment sizes
var TEXT_SEGMENT_SIZE_DEFAULT = 512;
var DATA_SEGMENT_SIZE_DEFAULT = 2048;
var POOL_SEGMENT_SIZE_DEFAULT = 512;
var STACK_SEGMENT_SIZE_DEFAULT = 512;

var KERNEL_SPACE_SIZE_DEFAULT = 0;

function provision(size, defaultSize) {
  return new Uint8Array(typeof size === 'number' ? size : defaultSize);
}

/**
 * True iff the address is between 0 and 2^61 - 1 inclusive
 * @param {Hex} address
 * @return {boolean}
 */
function isText(address) {
  return /^[01][0-9A-F]{15}$/.test(address);
}

/**
 * True iff the address is between 2^61 and 2^62 - 1 inclusive
 * @param {Hex} address
 * @return {boolean}
 */
function isData(address) {
  return /^[23][0-9A-F]{15}$/.test(address);
}

/**
 * True iff the address is between 2^62 and 6 * 2^60 - 1 inclusive
 * @param {Hex} address
 * @return {boolean}
 */
function isPool(address) {
  return /^[45][0-9A-F]{15}$/.test(address);
}

/**
 * True iff the address is between 6 * 2^60 and 2^63 - 1 inclusive
 * @param {Hex} address
 * @return {boolean}
 */
function isStack(address) {
  return /^[67][0-9A-F]{15}$/.test(address);
}

/**
 * True iff the address is equal to or above 2^63
 * @param {Hex} address
 * @return {boolean}
 */
function isKernel(address) {
  return /^[89A-F][0-9A-F]{15}$/.test(address);
}

/**
 * Returns the index and segment for an address.
 * @param {Hex} address
 * @param {Object} memory
 * @return {Object}
 */
function resolve(address, memory) {
  var l = Long.fromString(address, true, 16);
  var i = null;
  var segment = null;

  if (isText(address)) {
    segment = memory.text;
    i = l.toInt();
  }
 
  if (isData(address)) {
    segment = memory.data;
    i = l.subtract(Long.fromString('2000000000000000', true, 16)).toInt();
  }

  if (isPool(address)) {
    segment = memory.pool;
    i = l.subtract(Long.fromString('4000000000000000', true, 16)).toInt();
  }

  if (isStack(address)) {
    segment = memory.stack;
    i = l.subtract(Long.fromString('6000000000000000', true, 16)).toInt();
  }

  if (isKernel(address)) {
    segment = memory.kernel;
    i = l.subtract(Long.fromString('8000000000000000', true, 16)).toInt();
  }

  if (segment === null) {
    throw new Error('No memory segment contains the address: ' + address);
  }

  if (i >= segment.length) {
    throw new Error('Segment does not have an actual memory cell at address: ' + address);
  }

  return {segment: segment, index: i};
}

/**
 * @constructor
 * @param {number} [text] - bytes of memory the machine should have in its text
 * segment in user space
 * @param {number} [data] - bytes of memory in data segment
 * @param {number} [pool] - bytes of memory in pool segment
 * @param {number} [stack] - bytes of memory in stack segment
 * @param {number} [kernel] - bytes of memory for kernel space
 */
function Memory(text, data, pool, stack, kernel) {
  this.text = provision(text, TEXT_SEGMENT_SIZE_DEFAULT);
  this.data = provision(data, DATA_SEGMENT_SIZE_DEFAULT);
  this.pool = provision(pool, POOL_SEGMENT_SIZE_DEFAULT);
  this.stack = provision(stack, STACK_SEGMENT_SIZE_DEFAULT);
  this.kernel = provision(kernel, KERNEL_SPACE_SIZE_DEFAULT);
}

/**
 * @param {Hex} address
 * @return {number}
 */
Memory.prototype.getByte = function(address) {
  var m = resolve(address, this);

  return m.segment[m.index];
};

/**
 * @param {number} b
 * @param {Hex} address
 * @return {Hex}
 */
Memory.prototype.setByte = function(b, address) {
  var m = resolve(address, this);

  m.segment[m.index] = b;
};

module.exports = Memory;
