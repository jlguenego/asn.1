import {Lexer, createToken} from 'chevrotain';

// using createToken API
export const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /[ \t\n\r]+/,
  group: Lexer.SKIPPED,
});
export const DEFINITIONS = createToken({
  name: 'Definitions',
  pattern: /DEFINITIONS/,
});
export const SEQUENCE = createToken({
  name: 'Sequence',
  pattern: /SEQUENCE/,
});
export const AFFECTATION = createToken({name: 'Affectation', pattern: /::=/});
export const BEGIN = createToken({name: 'Begin', pattern: /BEGIN/});
export const END = createToken({name: 'End', pattern: /END/});
export const INTEGER = createToken({name: 'Integer', pattern: /INTEGER/});
export const IA5String = createToken({name: 'IA5String', pattern: /IA5String/});
export const UTF8String = createToken({
  name: 'UTF8String',
  pattern: /UTF8String/,
});
export const BOOLEAN = createToken({name: 'Boolean', pattern: /BOOLEAN/});
export const L_CURLY = createToken({name: 'LCurly', pattern: /{/});
export const R_CURLY = createToken({name: 'RCurly', pattern: /}/});
export const COMMA = createToken({name: 'Comma', pattern: /,/});
export const TypeReference = createToken({
  name: 'TypeReference',
  pattern: /[A-Z]\w*/,
});
export const Identifier = createToken({
  name: 'Identifier',
  pattern: /[a-z]\w*/,
});

export const allASN1Tokens = [
  WhiteSpace,
  // "keywords" appear before the Identifier
  DEFINITIONS,
  AFFECTATION,
  BEGIN,
  END,
  SEQUENCE,
  L_CURLY,
  R_CURLY,
  COMMA,
  INTEGER,
  IA5String,
  BOOLEAN,

  // The Identifier must appear after the keywords because all keywords are valid identifiers.
  Identifier,
  TypeReference,
];
