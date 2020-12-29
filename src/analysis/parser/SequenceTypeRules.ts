import {ASN1CstParser} from '../ASN1CstParser';
import {COMMA, Identifier, L_CURLY, R_CURLY} from '../ASN1Lexer';
import {k} from '../lexer/ASN1Keyword';

export function initSequenceTypeRules(this: ASN1CstParser) {
  this.RULE('SequenceType', () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(k.SEQUENCE);
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
    this.SUBRULE(this.NamedType);
    this.OPTION(() => {
      this.OR([
        {
          ALT: () => {
            this.CONSUME(k.DEFAULT);
            this.SUBRULE(this.Value);
          },
        },
        {
          ALT: () => {
            this.CONSUME(k.OPTIONAL);
          },
        },
      ]);
    });
  });

  this.RULE('NamedType', () => {
    this.CONSUME(Identifier);
    this.SUBRULE(this.Type);
  });
}
