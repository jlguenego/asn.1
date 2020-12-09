import {CstNode, TokenType} from 'chevrotain';

import {
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
  EXPLICIT,
  TAGS,
  IMPLICIT,
  AUTOMATIC,
  L_PARENTHESIS,
  R_PARENTHESIS,
  NumberToken,
  OBJECT,
  IDENTIFIER,
} from './ASN1Lexer';
import {ASN1ModuleIdentifierCstParser} from './parser/ASN1ModuleIdentifierCstParser';

export class ASN1CstParser extends ASN1ModuleIdentifierCstParser {
  public ModuleDefinition!: () => CstNode;
  public TagDefault!: () => CstNode;
  public ModuleBody!: (idx: number) => CstNode;
  public AssignmentList!: (idx: number) => CstNode;
  public Assignment!: (idx: number) => CstNode;
  public TypeAssignment!: (idx: number) => CstNode;
  public ValueAssignment!: (idx: number) => CstNode;
  public ValueReference!: (idx: number) => CstNode;
  public Value!: (idx: number) => CstNode;
  public BuiltinValue!: (idx: number) => CstNode;
  public ObjectIdentifierValue!: (idx: number) => CstNode;
  public ObjIdComponentsList!: (idx: number) => CstNode;
  public ObjIdComponents!: (idx: number) => CstNode;
  public NameAndNumberForm!: (idx: number) => CstNode;
  public NumberForm!: (idx: number) => CstNode;
  public Type!: (idx: number) => CstNode;
  public BuiltinType!: (idx: number) => CstNode;
  public SequenceType!: (idx: number) => CstNode;
  public IntegerType!: (idx: number) => CstNode;
  public BooleanType!: (idx: number) => CstNode;
  public ObjectIdentifierType!: (idx: number) => CstNode;
  public CharacterStringType!: (idx: number) => CstNode;
  public RestrictedCharacterStringType!: (idx: number) => CstNode;
  public ComponentTypeLists!: (idx: number) => CstNode;
  public ComponentTypeList!: (idx: number) => CstNode;
  public ComponentType!: (idx: number) => CstNode;
  public NamedType!: (idx: number) => CstNode;

  addRule(name: string, implementation: (...implArgs: unknown[]) => unknown) {
    this.RULE(name, implementation);
  }

  addSubrule(rule: (idx: number) => CstNode) {
    this.SUBRULE(rule);
  }

  addConsume(token: TokenType) {
    this.CONSUME(token);
  }

  constructor() {
    super();

    this.RULE('ModuleDefinition', () => {
      this.SUBRULE(this.ModuleIdentifier);
      this.CONSUME(DEFINITIONS);
      this.SUBRULE(this.TagDefault);
      this.CONSUME(AFFECTATION);
      this.CONSUME(BEGIN);
      this.SUBRULE(this.ModuleBody);
      this.CONSUME(END);
    });

    this.RULE('TagDefault', () => {
      this.OPTION(() => {
        this.OR([
          {
            ALT: () => {
              this.CONSUME(EXPLICIT);
            },
          },
          {
            ALT: () => {
              this.CONSUME(IMPLICIT);
            },
          },
          {
            ALT: () => {
              this.CONSUME(AUTOMATIC);
            },
          },
        ]);
        this.CONSUME(TAGS);
      });
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
        {
          ALT: () => {
            this.SUBRULE(this.ValueAssignment);
          },
        },
      ]);
    });

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
      this.OR([
        {
          ALT: () => {
            this.SUBRULE(this.ObjectIdentifierValue);
          },
        },
      ]);
    });

    this.RULE('ObjectIdentifierValue', () => {
      this.OR([
        {
          ALT: () => {
            this.CONSUME(L_CURLY);
            this.SUBRULE(this.ObjIdComponentsList);
            this.CONSUME(R_CURLY);
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
      this.OR([
        {
          ALT: () => {
            this.SUBRULE(this.NameAndNumberForm);
          },
        },
      ]);
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
            this.SUBRULE(this.ObjectIdentifierType);
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
