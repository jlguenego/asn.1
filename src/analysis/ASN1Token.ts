import {Lexer, createToken} from 'chevrotain';

// using createToken API
export const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /[ \t\n\r]+/,
  group: Lexer.SKIPPED,
});
export const Definitions = createToken({
  name: 'Definitions',
  pattern: /DEFINITIONS/,
});
export const Sequence = createToken({
  name: 'Sequence',
  pattern: /SEQUENCE/,
});
export const Assignment = createToken({name: 'Assignment', pattern: /::=/});
export const Begin = createToken({name: 'Begin', pattern: /BEGIN/});
export const End = createToken({name: 'End', pattern: /END/});
export const Integer = createToken({name: 'Integer', pattern: /INTEGER/});
export const IA5String = createToken({name: 'IA5String', pattern: /IA5String/});
export const Boolean = createToken({name: 'Boolean', pattern: /BOOLEAN/});
export const LCurly = createToken({name: 'LCurly', pattern: /{/});
export const RCurly = createToken({name: 'RCurly', pattern: /}/});
export const Comma = createToken({name: 'Comma', pattern: /,/});
export const Identifier = createToken({
  name: 'Identifier',
  pattern: /[a-zA-Z]\w*/,
});

export const allASN1Tokens = [
  WhiteSpace,
  // "keywords" appear before the Identifier
  Definitions,
  Assignment,
  Begin,
  End,
  Sequence,
  LCurly,
  RCurly,
  Comma,
  Integer,
  IA5String,
  Boolean,

  // The Identifier must appear after the keywords because all keywords are valid identifiers.
  Identifier,
];
