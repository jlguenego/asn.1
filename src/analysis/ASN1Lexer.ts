import {Lexer, createToken} from 'chevrotain';

export const Comment = createToken({
  name: 'Comment',
  pattern: /--.*(?:\n|--)/,
  group: Lexer.SKIPPED,
});

export const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /[ \t\n\r]+/,
  group: Lexer.SKIPPED,
});

// Keywords
export const AUTOMATIC = createToken({name: 'AUTOMATIC', pattern: /AUTOMATIC/});
export const BEGIN = createToken({name: 'BEGIN', pattern: /BEGIN/});
export const BIT = createToken({name: 'BIT', pattern: /BIT/});
export const BOOLEAN = createToken({name: 'BOOLEAN', pattern: /BOOLEAN/});
export const DEFINITIONS = createToken({
  name: 'DEFINITIONS',
  pattern: /DEFINITIONS/,
});
export const END = createToken({name: 'END', pattern: /END/});
export const EXPLICIT = createToken({
  name: 'EXPLICIT',
  pattern: /EXPLICIT/,
});
export const GeneralString = createToken({
  name: 'GeneralString',
  pattern: /GeneralString/,
});
export const IA5String = createToken({name: 'IA5String', pattern: /IA5String/});
export const IMPLICIT = createToken({
  name: 'IMPLICIT',
  pattern: /IMPLICIT/,
});
export const IDENTIFIER = createToken({
  name: 'IDENTIFIER',
  pattern: /IDENTIFIER/,
});
export const INTEGER = createToken({name: 'INTEGER', pattern: /INTEGER/});
export const MAX = createToken({name: 'MAX', pattern: /MAX/});
export const MIN = createToken({name: 'MIN', pattern: /MIN/});
export const OBJECT = createToken({name: 'OBJECT', pattern: /OBJECT/});
export const OCTET = createToken({name: 'OCTET', pattern: /OCTET/});
export const OF = createToken({name: 'OF', pattern: /OF/});
export const SEQUENCE = createToken({
  name: 'SEQUENCE',
  pattern: /SEQUENCE/,
});
export const SIZE = createToken({
  name: 'SIZE',
  pattern: /SIZE/,
});
export const TAGS = createToken({
  name: 'TAGS',
  pattern: /TAGS/,
});

export const AFFECTATION = createToken({name: 'AFFECTATION', pattern: /::=/});

export const STRING = createToken({name: 'STRING', pattern: /STRING/});
export const UTF8String = createToken({
  name: 'UTF8String',
  pattern: /UTF8String/,
});

export const L_CURLY = createToken({name: 'LCurly', pattern: /{/});
export const R_CURLY = createToken({name: 'RCurly', pattern: /}/});
export const L_PARENTHESIS = createToken({name: 'LParenthesis', pattern: /\(/});
export const R_PARENTHESIS = createToken({name: 'RParenthesis', pattern: /\)/});
export const L_SQUARE = createToken({name: 'LSquareBracket', pattern: /\[/});
export const R_SQUARE = createToken({name: 'RSquareBracket', pattern: /\]/});
export const COMMA = createToken({name: 'Comma', pattern: /,/});
export const RANGE_SEPARATOR = createToken({
  name: 'RangeSeparator',
  pattern: /[.][.]/,
});

export const TypeReference = createToken({
  name: 'TypeReference',
  // 12.2.1
  // Note: use of non capturing group. (?:xxx)
  pattern: /[A-Z](?:-?\w+)*/,
});
export const Identifier = createToken({
  name: 'Identifier',
  // 12.3
  pattern: /[a-z](?:-?\w+)*/,
});

export const NegativeNumberToken = createToken({
  name: 'NegativeNumber',
  // 12.8 and 19.1
  pattern: /-[1-9][0-9]*/,
});

export const NumberToken = createToken({
  name: 'Number',
  // 12.8
  pattern: /(?:[1-9][0-9]*)|0/,
});

export const allASN1Tokens = [
  Comment,
  WhiteSpace,

  // "keywords" appear before the Identifier
  AUTOMATIC,
  BEGIN,
  BIT,
  BOOLEAN,
  DEFINITIONS,
  END,
  EXPLICIT,
  GeneralString,
  IA5String,
  IDENTIFIER,
  IMPLICIT,
  INTEGER,
  MAX,
  MIN,
  OBJECT,
  OCTET,
  OF,
  SEQUENCE,
  SIZE,
  STRING,
  TAGS,

  // 3 chars
  AFFECTATION,
  // 2 chars
  RANGE_SEPARATOR,
  // 1 chars
  L_CURLY,
  R_CURLY,
  L_PARENTHESIS,
  R_PARENTHESIS,
  L_SQUARE,
  R_SQUARE,
  COMMA,

  // The Identifier must appear after the keywords because all keywords are valid identifiers.
  Identifier,
  TypeReference,
  NegativeNumberToken,
  NumberToken,
];

export const ASN1Lexer = new Lexer(allASN1Tokens);
