import {ASN1CstParser} from '../ASN1CstParser';
import {
  AFFECTATION,
  BOOLEAN,
  GeneralString,
  IA5String,
  Identifier,
  IDENTIFIER,
  NegativeNumberToken,
  NumberToken,
  OBJECT,
  UTF8String,
} from '../ASN1Lexer';

export function initBuiltinValueRules(this: ASN1CstParser) {
  this.RULE('ValueAssignment', () => {
    this.SUBRULE(this.ValueReference);
    this.SUBRULE(this.Type);
    this.CONSUME(AFFECTATION);
    this.SUBRULE(this.Value);
  });

  this.RULE('ValueReference', () => {
    this.CONSUME(Identifier);
  });

  this.RULE('Value', () => {
    this.OR([
      {
        ALT: () => {
          this.SUBRULE(this.BuiltinValue);
        },
      },
    ]);
  });

  this.RULE('BuiltinValue', () => {
    this.addOrList(['ObjectIdentifierValue', 'IntegerValue']);
  });

  this.RULE('IntegerValue', () => {
    this.addOrTokenList([Identifier, NumberToken, NegativeNumberToken]);
  });

  this.RULE('BooleanType', () => {
    this.CONSUME(BOOLEAN);
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

  this.RULE('DefinedValue', () => {
    this.addOrList(['ValueReference']);
  });
}
