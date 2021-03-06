import {createToken} from 'chevrotain';

const token = createToken({
  name: 'x',
  pattern: /x/,
});

export const k = {
  // 'ENCODING-CONTROL': token,
  // 'RELATIVE-OID-IRI': token,
  // 'ABSTRACT-SYNTAX': token,
  // 'TYPE-IDENTIFIER': token,
  // 'MINUS-INFINITY': token,
  // 'PLUS-INFINITY': token,
  // 'NOT-A-NUMBER': token,
  // 'RELATIVE-OID': token,
  // 'TIME-OF-DAY': token,
  // 'DATE-TIME': token,
  // 'OID-IRI': token,
  ObjectDescriptor: token,
  GeneralizedTime: token,
  PrintableString: token,
  UniversalString: token,
  VideotexString: token,
  EXTENSIBILITY: token,
  GeneralString: token,
  GraphicString: token,
  NumericString: token,
  TeletexString: token,
  VisibleString: token,
  INSTRUCTIONS: token,
  INTERSECTION: token,
  ISO646String: token,
  APPLICATION: token,
  CONSTRAINED: token,
  DEFINITIONS: token,
  COMPONENTS: token,
  CONTAINING: token,
  ENUMERATED: token,
  IDENTIFIER: token,
  UTF8String: token,
  AUTOMATIC: token,
  BMPString: token,
  CHARACTER: token,
  COMPONENT: token,
  IA5String: token,
  T61String: token,
  UNIVERSAL: token,
  DURATION: token,
  EMBEDDED: token,
  EXPLICIT: token,
  EXTERNAL: token,
  IMPLICIT: token,
  INCLUDES: token,
  INSTANCE: token,
  OPTIONAL: token,
  SEQUENCE: token,
  SETTINGS: token,
  BOOLEAN: token,
  DEFAULT: token,
  ENCODED: token,
  EXPORTS: token,
  IMPLIED: token,
  IMPORTS: token,
  INTEGER: token,
  PATTERN: token,
  PRESENT: token,
  PRIVATE: token,
  UTCTime: token,
  ABSENT: token,
  EXCEPT: token,
  OBJECT: token,
  CHOICE: token,
  STRING: token,
  SYNTAX: token,
  UNIQUE: token,
  CLASS: token,
  BEGIN: token,
  FALSE: token,
  OCTET: token,
  UNION: token,
  DATE: token,
  FROM: token,
  SIZE: token,
  REAL: token,
  TAGS: token,
  TIME: token,
  TRUE: token,
  WITH: token,
  ALL: token,
  END: token,
  MAX: token,
  SET: token,
  MIN: token,
  BIT: token,
  NULL: token,
  PDV: token,
  BY: token,
  OF: token,
};

export type KeywordObject = typeof k;
export type Keyword = keyof KeywordObject;

for (const name of Object.keys(k) as Keyword[]) {
  k[name] = createToken({
    name,
    pattern: new RegExp(name),
  });
}
