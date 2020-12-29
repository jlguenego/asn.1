import {ASN1CstParser} from '../ASN1CstParser';
import {
  AFFECTATION,
  Identifier,
  NegativeNumberToken,
  NumberToken,
} from '../ASN1Lexer';
import {k} from '../lexer/ASN1Keyword';

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
    this.addOrList(['ObjectIdentifierValue', 'IntegerValue', 'BooleanValue']);
  });

  this.RULE('IntegerValue', () => {
    this.addOrTokenList([Identifier, NumberToken, NegativeNumberToken]);
  });

  this.RULE('BooleanValue', () => {
    this.addOrTokenList([k.TRUE, k.FALSE]);
  });

  this.RULE('DefinedValue', () => {
    this.addOrList(['ValueReference']);
  });
}
