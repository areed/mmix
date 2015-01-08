var _ = require('./utils');
var arithmetic = require('./arithmetic');
var bitwise = require('./bitwise');
var branch = require('./branch');
var bytewise = require('./bytewise');
var compare = require('./compare');
var conditional = require('./conditional');
var immediate = require('./immediate');
var interrupts = require('./interrupts');
var load = require('./load');
var shift = require('./shift');
var store = require('./store');
var swym = require('./swym');

//0 stands for register, other numbers for the byte width of the argument, -1
//for unused byte
var $X_$Y_$Z = [0, 0, 0];
var $X_$Y_Z = [0, 0, 1];
var $X_Y_$Z = [0, 1, 0];
var $X_Y_Z = [0, 1, 1];
var $X_YZ = [0, 2];
var X_YZ = [1, 2];
var XYZ = [3];
var X_$Y_$Z = [1, 0, 0];
var X_$Y_Z = [1, 0, 1];
var $X_Z = [0, -1, 1];
var X_$Z = [1, -1, 0];
var X_Z = [1, -1, 1];
var $X_0 = [0, -1, -1];
var $Z = [-1, -1, 0];
var X_Y_Z = [1, 1, 1];
var niladic = [-1, -1, -1];

var opcodes = [
  //name, oops cost, mems cost, signature
  ['TRAP', 5, 0, X_Y_Z, interrupts.TRAP],
  ['FCMP', 1, 0, $X_$Y_$Z],
  ['FUN', 1, 0, $X_$Y_$Z],
  ['FEQL', 1, 0, $X_$Y_$Z],
  ['FADD', 4, 0, $X_$Y_$Z],
  ['FIX', 4, 0, $X_Y_$Z],
  ['FSUB', 4, 0, $X_$Y_$Z],
  ['FIXU', 4, 0, $X_Y_$Z],
  ['FLOT', 4, 0, $X_Y_$Z],
  ['FLOTI', 4, 0, $X_Y_Z],
  ['FLOTU', 4, 0, $X_Y_$Z],
  ['FLOTUI', 4, 0, $X_Y_Z],
  ['SFLOT', 4, 0, $X_Y_$Z],
  ['SFLOTI', 4, 0, $X_Y_Z],
  ['SFLOTU', 4, 0, $X_Y_$Z],
  ['SFLOTUI', 4, 0, $X_Y_Z],
  ['FMUL', 4, 0, $X_$Y_$Z],
  ['FCMPE', 4, 0, $X_$Y_$Z],
  ['FUNE', 1, 0, $X_$Y_$Z],
  ['FEQLE', 4, 0, $X_$Y_$Z],
  ['FDIV', 40, 0, $X_$Y_$Z],
  ['FSQRT', 40, 0, $X_Y_$Z],
  ['FREM', 4, 0, $X_$Y_$Z],
  ['FINT', 4, 0, $X_Y_$Z],
  ['MUL', 10, 0, $X_$Y_$Z, arithmetic.MUL],
  ['MULI', 10, 0, $X_$Y_Z, arithmetic.MULI],
  ['MULU', 10, 0, $X_$Y_$Z, arithmetic.MULU],
  ['MULUI', 10, 0, $X_$Y_Z, arithmetic.MULUI],
  ['DIV', 60, 0, $X_$Y_$Z, arithmetic.DIV],
  ['DIVI', 60, 0, $X_$Y_Z, arithmetic.DIVI],
  ['DIVU', 60, 0, $X_$Y_$Z, arithmetic.DIVU],
  ['DIVUI', 60, 0, $X_$Y_Z, arithmetic.DIVUI],
  ['ADD', 1, 0, $X_$Y_$Z, arithmetic.ADD],
  ['ADDI', 1, 0, $X_$Y_Z, arithmetic.ADDI],
  ['ADDU', 1, 0, $X_$Y_$Z, arithmetic.ADDU],
  ['ADDUI', 1, 0, $X_$Y_Z, arithmetic.ADDUI],
  ['SUB', 1, 0, $X_$Y_$Z, arithmetic.SUB],
  ['SUBI', 1, 0, $X_$Y_Z, arithmetic.SUBI],
  ['SUBU', 1, 0, $X_$Y_$Z, arithmetic.SUBU],
  ['SUBUI', 1, 0, $X_$Y_Z, arithmetic.SUBUI],
  ['2ADDU', 1, 0, $X_$Y_$Z, arithmetic['2ADDU']],
  ['2ADDUI', 1, 0, $X_$Y_Z, arithmetic['2ADDUI']],
  ['4ADDU', 1, 0, $X_$Y_$Z, arithmetic['4ADDU']],
  ['4ADDUI', 1, 0, $X_$Y_Z, arithmetic['4ADDUI']],
  ['8ADDU', 1, 0, $X_$Y_$Z, arithmetic['8ADDU']],
  ['8ADDUI', 1, 0, $X_$Y_Z, arithmetic['8ADDUI']],
  ['16ADDU', 1, 0, $X_$Y_$Z, arithmetic['16ADDU']],
  ['16ADDUI', 1, 0, $X_$Y_Z, arithmetic['16ADDUI']],
  ['CMP', 1, 0, $X_$Y_$Z, compare.CMP],
  ['CMPI', 1, 0, $X_$Y_Z, compare.CMPI],
  ['CMPU', 1, 0, $X_$Y_$Z, compare.CMPU],
  ['CMPUI', 1, 0, $X_$Y_Z, compare.CMPUI],
  ['NEG', 1, 0, $X_Y_$Z, arithmetic.NEG],
  ['NEGI', 1, 0, $X_Y_Z, arithmetic.NEGI],
  ['NEGU', 1, 0, $X_Y_$Z, arithmetic.NEGU],
  ['NEGUI', 1, 0, $X_Y_Z, arithmetic.NEGUI],
  ['SL', 1, 0, $X_$Y_$Z, shift.SL],
  ['SLI', 1, 0, $X_$Y_Z, shift.SLI],
  ['SLU', 1, 0, $X_$Y_$Z, shift.SLU],
  ['SLUI', 1, 0, $X_$Y_Z, shift.SLUI],
  ['SR', 1, 0, $X_$Y_$Z, shift.SR],
  ['SRI', 1, 0, $X_$Y_Z, shift.SRI],
  ['SRU', 1, 0, $X_$Y_$Z, shift.SRU],
  ['SRUI', 1, 0, $X_$Y_Z, shift.SRUI],
  //actual cost of branching operations depends on whether the branch is taken
  ['BN', 1, 0, $X_YZ, branch.BN],
  ['BNB', 1, 0, $X_YZ, branch.BNB],
  ['BZ', 1, 0, $X_YZ, branch.BZ],
  ['BZB', 1, 0, $X_YZ, branch.BZB],
  ['BP', 1, 0, $X_YZ, branch.BP],
  ['BPB', 1, 0, $X_YZ, branch.BPB],
  ['BOD', 1, 0, $X_YZ, branch.BOD],
  ['BODB', 1, 0, $X_YZ, branch.BODB],
  ['BNN', 1, 0, $X_YZ, branch.BNN],
  ['BNNB', 1, 0, $X_YZ, branch.BNNB],
  ['BNZ', 1, 0, $X_YZ, branch.BNZ],
  ['BNZB', 1, 0, $X_YZ, branch.BNZB],
  ['BNP', 1, 0, $X_YZ, branch.BNP],
  ['BNPB', 1, 0, $X_YZ, branch.BNPB],
  ['BEV', 1, 0, $X_YZ, branch.BEV],
  ['BEVB', 1, 0, $X_YZ, branch.BEVB],
  ['PBN', 1, 0, $X_YZ, branch.BN],
  ['PBNB', 1, 0, $X_YZ, branch.BNB],
  ['PBZ', 1, 0, $X_YZ, branch.BZ],
  ['PBZB', 1, 0, $X_YZ, branch.BZB],
  ['PBP', 1, 0, $X_YZ, branch.BP],
  ['PBPB', 1, 0, $X_YZ, branch.BPB],
  ['PBOD', 1, 0, $X_YZ, branch.BOD],
  ['PBODB', 1, 0, $X_YZ, branch.BODB],
  ['PBNN', 1, 0, $X_YZ, branch.BNN],
  ['PBNNB', 1, 0, $X_YZ, branch.BNNB],
  ['PBNZ', 1, 0, $X_YZ, branch.BNZ],
  ['PBNZB', 1, 0, $X_YZ, branch.BNZB],
  ['PBNP', 1, 0, $X_YZ, branch.BNP],
  ['PBNPB', 1, 0, $X_YZ, branch.BNPB],
  ['PBEV', 1, 0, $X_YZ, branch.BEV],
  ['PBEVB', 1, 0, $X_YZ, branch.BEVB],
  ['CSN', 1, 0, $X_$Y_$Z, conditional.CSN],
  ['CSNI', 1, 0, $X_$Y_Z, conditional.CSNI],
  ['CSZ', 1, 0, $X_$Y_$Z, conditional.CSZ],
  ['CSZI', 1, 0, $X_$Y_Z, conditional.CSZI],
  ['CSP', 1, 0, $X_$Y_$Z, conditional.CSP],
  ['CSPI', 1, 0, $X_$Y_Z, conditional.CSPI],
  ['CSOD', 1, 0, $X_$Y_$Z, conditional.CSOD],
  ['CSODI', 1, 0, $X_$Y_Z, conditional.CSODI],
  ['CSNN', 1, 0, $X_$Y_$Z, conditional.CSNN],
  ['CSNNI', 1, 0, $X_$Y_Z, conditional.CSNNI],
  ['CSNZ', 1, 0, $X_$Y_$Z, conditional.CSNZ],
  ['CSNZI', 1, 0, $X_$Y_Z, conditional.CSNZI],
  ['CSNP', 1, 0, $X_$Y_$Z, conditional.CSNP],
  ['CSNPI', 1, 0, $X_$Y_Z, conditional.CSNPI],
  ['CSEV', 1, 0, $X_$Y_$Z, conditional.CSEV],
  ['CSEVI', 1, 0, $X_$Y_Z, conditional.CSEVI],
  ['ZSN', 1, 0, $X_$Y_$Z, conditional.ZSN],
  ['ZSNI', 1, 0, $X_$Y_Z, conditional.ZSNI],
  ['ZSZ', 1, 0, $X_$Y_$Z, conditional.ZSZ],
  ['ZSZI', 1, 0, $X_$Y_Z, conditional.ZSZI],
  ['ZSP', 1, 0, $X_$Y_$Z, conditional.ZSP],
  ['ZSPI', 1, 0, $X_$Y_Z, conditional.ZSPI],
  ['ZSOD', 1, 0, $X_$Y_$Z, conditional.ZSOD],
  ['ZSODI', 1, 0, $X_$Y_Z, conditional.ZSODI],
  ['ZSNN', 1, 0, $X_$Y_$Z, conditional.ZSNN],
  ['ZSNNI', 1, 0, $X_$Y_Z, conditional.ZSNNI],
  ['ZSNZ', 1, 0, $X_$Y_$Z, conditional.ZSNZ],
  ['ZSNZI', 1, 0, $X_$Y_Z, conditional.ZSNZI],
  ['ZSNP', 1, 0, $X_$Y_$Z, conditional.ZSNP],
  ['ZSNPI', 1, 0, $X_$Y_Z, conditional.ZSNPI],
  ['ZSEV', 1, 0, $X_$Y_$Z, conditional.ZSEV],
  ['ZSEVI', 1, 0, $X_$Y_Z, conditional.ZSEVI],
  ['LDB', 1, 1, $X_$Y_$Z, load.LDB],
  ['LDBI', 1, 1, $X_$Y_Z, load.LDBI],
  ['LDBU', 1, 1, $X_$Y_$Z, load.LDBU],
  ['LDBUI', 1, 1, $X_$Y_Z, load.LDBUI],
  ['LDW', 1, 1, $X_$Y_$Z, load.LDW],
  ['LDWI', 1, 1, $X_$Y_Z, load.LDWI],
  ['LDWU', 1, 1, $X_$Y_$Z, load.LDWU],
  ['LDWUI', 1, 1, $X_$Y_Z, load.LDWUI],
  ['LDT', 1, 1, $X_$Y_$Z, load.LDT],
  ['LDTI', 1, 1, $X_$Y_Z, load.LDTI],
  ['LDTU', 1, 1, $X_$Y_$Z, load.LDTU],
  ['LDTUI', 1, 1, $X_$Y_Z, load.LDTUI],
  ['LDO', 1, 1, $X_$Y_$Z, load.LDO],
  ['LDOI', 1, 1, $X_$Y_Z, load.LDOI],
  ['LDOU', 1, 1, $X_$Y_$Z, load.LDOU],
  ['LDOUI', 1, 1, $X_$Y_Z, load.LDOUI],
  ['LDSF', 1, 1, $X_$Y_$Z],
  ['LDSFI', 1, 1, $X_$Y_$Z],
  ['LDHT', 1, 1, $X_$Y_$Z, load.LDHT],
  ['LDHTI', 1, 1, $X_$Y_Z, load.LDHTI],
  ['CSWAP', 2, 2, $X_$Y_$Z],
  ['CSWAPI', 2, 2, $X_$Y_Z],
  ['LDUNC', 1, 1, $X_$Y_$Z],
  ['LDUNCI', 1, 1, $X_$Y_Z],
  ['LDVTS', 1, 0, $X_$Y_$Z],
  ['LDVTSI', 1, 0, $X_$Y_Z],
  ['PRELD', 1, 0, X_$Y_$Z],
  ['PRELDI', 1, 0, X_$Y_Z],
  ['PREGO', 1, 0, X_$Y_$Z],
  ['PREGOI', 1, 0, X_$Y_Z],
  ['GO', 1, 0, $X_$Y_$Z],
  ['GOI', 1, 0, $X_$Y_Z],
  ['STB', 1, 1, $X_$Y_$Z, store.STB],
  ['STBI', 1, 1, $X_$Y_Z, store.STBI],
  ['STBU', 1, 1,  $X_$Y_$Z, store.STBU],
  ['STBUI', 1, 1, $X_$Y_Z, store.STBUI],
  ['STW', 1, 1,  $X_$Y_$Z, store.STW],
  ['STWI', 1, 1, $X_$Y_Z, store.STWI],
  ['STWU', 1, 1,  $X_$Y_$Z, store.STWU],
  ['STWUI', 1, 1, $X_$Y_Z, store.STWUI],
  ['STT', 1, 1,  $X_$Y_$Z, store.STT],
  ['STTI', 1, 1, $X_$Y_Z, store.STTI],
  ['STTU', 1, 1,  $X_$Y_$Z, store.STTU],
  ['STTUI', 1, 1, $X_$Y_Z, store.STTUI],
  ['STO', 1, 1,  $X_$Y_$Z, store.STO],
  ['STOI', 1, 1, $X_$Y_Z, store.STOI],
  ['STOU', 1, 1,  $X_$Y_$Z, store.STOU],
  ['STOUI', 1, 1, $X_$Y_Z, store.STOUI],
  ['STSF', 1, 1, $X_$Y_$Z],
  ['STSFI', 1, 1,  $X_$Y_Z],
  ['STHT', 1, 1, $X_$Y_$Z, store.STHT],
  ['STHTI', 1, 1, $X_$Y_Z, store.STHTI],
  ['STCO', 1, 1, $X_$Y_$Z, store.STCO],
  ['STCOI', 1, 1, $X_$Y_Z, store.STCOI],
  ['STUNC', 1, 1, $X_$Y_$Z],
  ['STUNCI', 1, 1, $X_$Y_Z],
  ['SYNCD', 1, 0, X_$Y_$Z],
  ['SYNCDI', 1, 0, X_$Y_Z],
  ['PREST', 1, 0, X_$Y_$Z],
  ['PRESTI', 1, 0, X_$Y_Z],
  ['SYNCID', 1, 0, X_$Y_$Z],
  ['SYNCIDI', 1, 0, X_$Y_Z],
  ['PUSHGO', 3, 0, $X_$Y_$Z],
  ['PUSHGOI', 3, 0, $X_$Y_Z],
  ['OR', 1, 0, $X_$Y_$Z, bitwise.OR],
  ['ORI', 1, 0, $X_$Y_Z, bitwise.ORI],
  ['ORN', 1, 0, $X_$Y_$Z, bitwise.ORN],
  ['ORNI', 1, 0, $X_$Y_Z, bitwise.ORNI],
  ['NOR', 1, 0, $X_$Y_$Z, bitwise.NOR],
  ['NORI', 1, 0, $X_$Y_Z, bitwise.NORI],
  ['XOR', 1, 0, $X_$Y_$Z, bitwise.XOR],
  ['XORI', 1, 0, $X_$Y_Z, bitwise.XORI],
  ['AND', 1, 0, $X_$Y_$Z, bitwise.AND],
  ['ANDI', 1, 0, $X_$Y_Z, bitwise.ANDI],
  ['ANDN', 1, 0, $X_$Y_$Z, bitwise.ANDN],
  ['ANDNI', 1, 0, $X_$Y_Z, bitwise.ANDNI],
  ['NAND', 1, 0, $X_$Y_$Z, bitwise.NAND],
  ['NANDI', 1, 0, $X_$Y_Z, bitwise.NANDI],
  ['NXOR', 1, 0, $X_$Y_$Z, bitwise.NXOR],
  ['NXORI', 1, 0, $X_$Y_Z, bitwise.NXORI],
  ['BDIF', 1, 0, $X_$Y_$Z, bytewise.BDIF],
  ['BDIFI', 1, 0, $X_$Y_Z, bytewise.BDIFI],
  ['WDIF', 1, 0, $X_$Y_$Z, bytewise.WDIF],
  ['WDIFI', 1, 0, $X_$Y_Z, bytewise.WDIFI],
  ['TDIF', 1, 0, $X_$Y_$Z, bytewise.TDIF],
  ['TDIFI', 1, 0, $X_$Y_Z, bytewise.TDIFI],
  ['ODIF', 1, 0, $X_$Y_$Z, bytewise.ODIF],
  ['ODIFI', 1, 0, $X_$Y_Z, bytewise.ODIFI],
  ['MUX', 1, 0, $X_$Y_$Z, bitwise.MUX],
  ['MUXI', 1, 0, $X_$Y_Z, bitwise.MUXI],
  ['SADD', 1, 0, $X_$Y_$Z, bytewise.SADD],
  ['SADDI', 1, 0, $X_$Y_Z, bytewise.SADDI],
  ['MOR', 1, 0, $X_$Y_$Z, bytewise.MOR],
  ['MORI', 1, 0, $X_$Y_Z, bytewise.MORI],
  ['MXOR', 1, 0, $X_$Y_$Z, bytewise.MXOR],
  ['MXORI', 1, 0, $X_$Y_Z, bytewise.MXORI],
  ['SETH', 1, 0, $X_YZ, immediate.SETH],
  ['SETMH', 1, 0, $X_YZ, immediate.SETMH],
  ['SETML', 1, 0, $X_YZ, immediate.SETML],
  ['SETL', 1, 0, $X_YZ, immediate.SETL],
  ['INCH', 1, 0, $X_YZ, immediate.INCH],
  ['INCMH', 1, 0, $X_YZ, immediate.INCMH],
  ['INCML', 1, 0, $X_YZ, immediate.INCML],
  ['INCL', 1, 0, $X_YZ, immediate.INCL],
  ['ORH', 1, 0, $X_YZ, immediate.ORH],
  ['ORMH', 1, 0, $X_YZ, immediate.ORMH],
  ['ORML', 1, 0, $X_YZ, immediate.ORML],
  ['ORL', 1, 0, $X_YZ, immediate.ORL],
  ['ANDNH', 1, 0, $X_YZ, immediate.ANDNH],
  ['ANDNMH', 1, 0, $X_YZ, immediate.ANDNMH],
  ['ANDNML', 1, 0, $X_YZ, immediate.ANDNML],
  ['ANDNL', 1, 0, $X_YZ, immediate.ANDNL],
  ['JMP', 1, 0, XYZ],
  ['JMPB', 1, 0, XYZ],
  ['PUSHJ', 1, 0, $X_YZ],
  ['PUSHJB', 1, 0, $X_YZ],
  ['GETA', 1, 0, $X_YZ],
  ['GETAB', 1, 0, $X_YZ],
  ['PUT', 1, 0, X_$Z],
  ['PUTI', 1, 0, X_Z],
  ['POP', 3, 0, X_YZ],
  ['RESUME', 5, 0, niladic, interrupts.RESUME],
  ['SAVE', 1, 20, $X_0],
  ['UNSAVE', 1, 20, $Z],
  ['SYNC', 1, 0, XYZ],
  ['SWYM', 1, 0, XYZ, swym],
  ['GET', 1, 0, $X_Z],
  ['TRIP', 5, 0, X_Y_Z, interrupts.TRIP],
];

exports.opnames = opcodes.reduce(function(memo, op, index) {
  var key = _.hexifyByte(index);
  memo[key] = op[0];
  return memo;
}, {});

exports.opcodes = opcodes.reduce(function(memo, op, index) {
  memo[op[0]] = index;
  return memo;
}, {});

exports.formats = opcodes.reduce(function(memo, op) {
  memo[op[0]] = op[3];
  return memo;
}, {});

exports.costs = opcodes.reduce(function(memo, op, index) {
  var key = _.hexifyByte(index);
  memo[key] = {oops: op[1], mems: op[2]};
  return memo;
}, {});

exports.ops = opcodes.map(function(o) {
  return o[4];
});
