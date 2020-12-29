import {ASN1CstParser} from '../ASN1CstParser';
import {
  Identifier,
  L_CURLY,
  L_PARENTHESIS,
  NumberToken,
  R_CURLY,
  R_PARENTHESIS,
} from '../ASN1Lexer';

export function initObjectIdentifierValueRules(this: ASN1CstParser) {
  this.RULE('ObjectIdentifierValue', () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(L_CURLY);
          this.SUBRULE(this.DefinedValue);
          this.SUBRULE(this.ObjIdComponentsList);
          this.CONSUME(R_CURLY);
        },
      },
      {
        ALT: () => {
          this.CONSUME1(L_CURLY);
          this.SUBRULE1(this.ObjIdComponentsList);
          this.CONSUME1(R_CURLY);
        },
      },
    ]);
  });

  this.RULE('ObjIdComponentsList', () => {
    this.MANY(() => {
      this.SUBRULE(this.ObjIdComponents);
    });
  });

  this.RULE('ObjIdComponents', () => {
    this.addOrList(['NameAndNumberForm', 'NumberForm']);
  });

  this.RULE('NameAndNumberForm', () => {
    this.CONSUME(Identifier);
    this.CONSUME(L_PARENTHESIS);
    this.SUBRULE(this.NumberForm);
    this.CONSUME(R_PARENTHESIS);
  });

  this.RULE('NumberForm', () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(NumberToken);
        },
      },
    ]);
  });
}
