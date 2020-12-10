import {Lexer, createToken} from 'chevrotain';
import {k} from './lexer/ASN1Keyword';

export const Comment = createToken({
  name: 'Comment',
  pattern: /--.*?(?:\n|--)/,
  group: Lexer.SKIPPED,
});

export const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /[ \t\n\r]+/,
  group: Lexer.SKIPPED,
});

// Keywords
export const AFFECTATION = createToken({name: 'AFFECTATION', pattern: /::=/});

export const L_CURLY = createToken({name: 'LCurly', pattern: /{/});
export const R_CURLY = createToken({name: 'RCurly', pattern: /}/});
export const L_PARENTHESIS = createToken({name: 'LParenthesis', pattern: /\(/});
export const R_PARENTHESIS = createToken({name: 'RParenthesis', pattern: /\)/});
export const L_SQUARE = createToken({name: 'LSquareBracket', pattern: /\[/});
export const R_SQUARE = createToken({name: 'RSquareBracket', pattern: /\]/});
export const COMMA = createToken({name: 'Comma', pattern: /,/});
export const PIPE = createToken({name: 'Pipe', pattern: /\|/});
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

  ...Object.values(k),

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
  PIPE,

  // The Identifier must appear after the keywords because all keywords are valid identifiers.
  Identifier,
  TypeReference,
  NegativeNumberToken,
  NumberToken,
];

export const ASN1Lexer = new Lexer(allASN1Tokens);
