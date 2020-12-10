import {ASN1CstParser} from '../ASN1CstParser';
import {COMMA, Identifier, L_CURLY, R_CURLY, SEQUENCE} from '../ASN1Lexer';

export function initSequenceTypeRules(this: ASN1CstParser) {
  this.RULE('SequenceType', () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(SEQUENCE);
          this.CONSUME(L_CURLY);
          this.OPTION(() => {
            this.SUBRULE(this.ComponentTypeLists);
          });
          this.CONSUME(R_CURLY);
        },
      },
    ]);
  });

  this.RULE('ComponentTypeLists', () => {
    this.OR([
      {
        ALT: () => {
          this.SUBRULE(this.ComponentTypeList);
        },
      },
    ]);
  });

  this.RULE('ComponentTypeList', () => {
    this.SUBRULE(this.ComponentType);
    this.OPTION(() => {
      this.CONSUME(COMMA);
      this.SUBRULE(this.ComponentTypeList);
    });
  });

  this.RULE('ComponentType', () => {
    this.OR([
      {
        ALT: () => {
          this.SUBRULE(this.NamedType);
        },
      },
    ]);
  });

  this.RULE('NamedType', () => {
    this.CONSUME(Identifier);
    this.SUBRULE(this.Type);
  });
}
