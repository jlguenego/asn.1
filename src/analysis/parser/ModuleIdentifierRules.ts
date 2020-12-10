import {ASN1CstParser} from '../ASN1CstParser';

import {
  Identifier,
  TypeReference,
  L_CURLY,
  R_CURLY,
  R_PARENTHESIS,
  L_PARENTHESIS,
  NumberToken,
} from '../ASN1Lexer';

export function initModuleIdentifierRules(this: ASN1CstParser) {
  this.RULE('ModuleIdentifier', () => {
    this.CONSUME(TypeReference);
    this.SUBRULE(this.DefinitiveIdentification);
  });

  this.RULE('DefinitiveIdentification', () => {
    this.OR([
      {
        ALT: () => {
          this.SUBRULE(this.DefinitiveOID);
        },
      },
      {
        ALT: () => {},
      },
    ]);
  });

  this.RULE('DefinitiveOID', () => {
    this.CONSUME(L_CURLY);
    this.SUBRULE(this.DefinitiveObjIdComponentList);
    this.CONSUME(R_CURLY);
  });

  this.RULE('DefinitiveObjIdComponentList', () => {
    this.MANY(() => {
      this.SUBRULE(this.DefinitiveObjIdComponent);
    });
  });

  this.RULE('DefinitiveObjIdComponent', () => {
    this.OR([
      {
        ALT: () => {
          this.SUBRULE(this.DefinitiveNameAndNumberForm);
        },
      },
    ]);
  });

  this.RULE('DefinitiveNameAndNumberForm', () => {
    this.CONSUME(Identifier);
    this.CONSUME(L_PARENTHESIS);
    this.CONSUME(NumberToken);
    this.CONSUME(R_PARENTHESIS);
  });
}
