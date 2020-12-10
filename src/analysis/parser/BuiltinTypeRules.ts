import {ASN1CstParser} from '../ASN1CstParser';
import {
  BIT,
  BOOLEAN,
  GeneralString,
  IA5String,
  IDENTIFIER,
  OBJECT,
  OCTET,
  STRING,
  UTF8String,
} from '../ASN1Lexer';

export function initBuiltinTypeRules(this: ASN1CstParser) {
  this.RULE('BooleanType', () => {
    this.CONSUME(BOOLEAN);
  });

  this.RULE('BitStringType', () => {
    this.CONSUME(BIT);
    this.CONSUME(STRING);
  });

  this.RULE('OctetStringType', () => {
    this.CONSUME(OCTET);
    this.CONSUME(STRING);
  });

  this.RULE('ObjectIdentifierType', () => {
    this.CONSUME(OBJECT);
    this.CONSUME(IDENTIFIER);
  });

  this.RULE('CharacterStringType', () => {
    this.OR([
      {
        ALT: () => {
          this.SUBRULE(this.RestrictedCharacterStringType);
        },
      },
    ]);
  });

  this.RULE('RestrictedCharacterStringType', () => {
    this.addOrTokenList([GeneralString, IA5String, UTF8String]);
  });
}
