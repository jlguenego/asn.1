import {CstParser, CstNode} from 'chevrotain';

import {
  allASN1Tokens,
  AFFECTATION,
  BEGIN,
  DEFINITIONS,
  END,
  Identifier,
  TypeReference,
  IA5String,
  UTF8String,
  INTEGER,
  BOOLEAN,
  SEQUENCE,
  L_CURLY,
  R_CURLY,
  COMMA,
} from './ASN1Lexer';

export class ASN1Parser extends CstParser {
  public ModuleDefinition!: () => CstNode;
  private ModuleBody!: (idx: number) => CstNode;
  private AssignmentList!: (idx: number) => CstNode;
  private Assignment!: (idx: number) => CstNode;
  private TypeAssignment!: (idx: number) => CstNode;
  private Type!: (idx: number) => CstNode;
  private BuiltinType!: (idx: number) => CstNode;
  private SequenceType!: (idx: number) => CstNode;
  private IntegerType!: (idx: number) => CstNode;
  private BooleanType!: (idx: number) => CstNode;
  private CharacterStringType!: (idx: number) => CstNode;
  private RestrictedCharacterStringType!: (idx: number) => CstNode;
  private ComponentTypeLists!: (idx: number) => CstNode;
  private ComponentTypeList!: (idx: number) => CstNode;
  private ComponentType!: (idx: number) => CstNode;
  private NamedType!: (idx: number) => CstNode;

  constructor() {
    super(allASN1Tokens);

    this.RULE('ModuleDefinition', () => {
      this.CONSUME(TypeReference);
      this.CONSUME(DEFINITIONS);
      this.CONSUME(AFFECTATION);
      this.CONSUME(BEGIN);
      this.SUBRULE(this.ModuleBody);
      this.CONSUME(END);
    });

    this.RULE('ModuleBody', () => {
      this.SUBRULE(this.AssignmentList);
    });

    this.RULE('AssignmentList', () => {
      this.MANY(() => {
        this.SUBRULE(this.Assignment);
      });
    });

    this.RULE('Assignment', () => {
      this.OR([
        {
          ALT: () => {
            this.SUBRULE(this.TypeAssignment);
          },
        },
      ]);
    });

    this.RULE('TypeAssignment', () => {
      this.CONSUME(TypeReference);
      this.CONSUME(AFFECTATION);
      this.SUBRULE(this.Type);
    });

    this.RULE('Type', () => {
      this.OR([
        {
          ALT: () => {
            this.SUBRULE(this.BuiltinType);
          },
        },
      ]);
    });

    this.RULE('BuiltinType', () => {
      this.OR([
        {
          ALT: () => {
            this.SUBRULE(this.BooleanType);
          },
        },
        {
          ALT: () => {
            this.SUBRULE(this.CharacterStringType);
          },
        },
        {
          ALT: () => {
            this.SUBRULE(this.IntegerType);
          },
        },
        {
          ALT: () => {
            this.SUBRULE(this.SequenceType);
          },
        },
      ]);
    });

    this.RULE('BooleanType', () => {
      this.CONSUME(BOOLEAN);
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
      this.OR([
        {
          ALT: () => {
            this.CONSUME(IA5String);
          },
        },
        {
          ALT: () => {
            this.CONSUME(UTF8String);
          },
        },
      ]);
    });

    this.RULE('IntegerType', () => {
      this.OR([
        {
          ALT: () => {
            this.CONSUME(INTEGER);
          },
        },
      ]);
    });

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

    this.performSelfAnalysis();
  }
}
