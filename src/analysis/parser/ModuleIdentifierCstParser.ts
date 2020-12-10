import {CstParser, CstNode} from 'chevrotain';

import {
  allASN1Tokens,
  Identifier,
  TypeReference,
  L_CURLY,
  R_CURLY,
  R_PARENTHESIS,
  L_PARENTHESIS,
  NumberToken,
} from '../ASN1Lexer';

export class ASN1ModuleIdentifierCstParser extends CstParser {
  public ModuleIdentifier!: () => CstNode;
  public DefinitiveIdentification!: () => CstNode;
  public DefinitiveOID!: () => CstNode;
  public DefinitiveObjIdComponentList!: () => CstNode;
  public DefinitiveObjIdComponent!: () => CstNode;
  public DefinitiveNameAndNumberForm!: () => CstNode;

  constructor() {
    super(allASN1Tokens);

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
}
