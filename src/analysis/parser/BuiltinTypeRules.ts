import {ASN1CstParser} from '../ASN1CstParser';
import {k} from '../lexer/ASN1Keyword';

export function initBuiltinTypeRules(this: ASN1CstParser) {
  this.RULE('BooleanType', () => {
    this.CONSUME(k.BOOLEAN);
  });

  this.RULE('BitStringType', () => {
    this.CONSUME(k.BIT);
    this.CONSUME(k.STRING);
  });

  this.RULE('OctetStringType', () => {
    this.CONSUME(k.OCTET);
    this.CONSUME(k.STRING);
  });

  this.RULE('ObjectIdentifierType', () => {
    this.CONSUME(k.OBJECT);
    this.CONSUME(k.IDENTIFIER);
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
    this.addOrTokenList([k.GeneralString, k.IA5String, k.UTF8String]);
  });
}
