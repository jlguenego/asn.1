import {ASN1CstParser} from '../ASN1CstParser';
import {
  COMMA,
  Identifier,
  INTEGER,
  L_CURLY,
  L_PARENTHESIS,
  NegativeNumberToken,
  NumberToken,
  R_CURLY,
  R_PARENTHESIS,
} from '../ASN1Lexer';

export function initIntegerTypeRules(this: ASN1CstParser) {
  this.RULE('IntegerType', () => {
    this.CONSUME(INTEGER);
    this.OPTION(() => {
      this.CONSUME(L_CURLY);
      this.SUBRULE(this.NamedNumberList);
      this.CONSUME(R_CURLY);
    });
  });

  this.RULE('NamedNumberList', () => {
    this.SUBRULE(this.NamedNumber);
    this.OPTION(() => {
      this.CONSUME(COMMA);
      this.SUBRULE(this.NamedNumberList);
    });
  });

  this.RULE('NamedNumber', () => {
    this.CONSUME(Identifier);
    this.CONSUME(L_PARENTHESIS);
    this.addOrList(['SignedNumber', 'DefinedValue']);
    this.CONSUME(R_PARENTHESIS);
  });

  this.RULE('SignedNumber', () => {
    this.addOr([
      {
        ALT: () => {
          this.CONSUME(NumberToken);
        },
      },
      {
        ALT: () => {
          this.CONSUME(NegativeNumberToken);
        },
      },
    ]);
  });
}
