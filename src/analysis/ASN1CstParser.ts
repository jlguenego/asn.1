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

type Rule = (idx?: number) => CstNode;

export class ASN1CstParser extends ASN1ModuleIdentifierCstParser {
  public ModuleDefinition!: Rule;
  public TagDefault!: Rule;
  public ModuleBody!: Rule;
  public AssignmentList!: Rule;
  public Assignment!: Rule;
  public TypeAssignment!: Rule;
  public ValueAssignment!: Rule;
  public ValueReference!: Rule;
  public Value!: Rule;
  public BuiltinValue!: Rule;
  public ObjectIdentifierValue!: Rule;
  public ObjIdComponentsList!: Rule;
  public ObjIdComponents!: Rule;
  public NameAndNumberForm!: Rule;
  public NumberForm!: Rule;
  public Type!: Rule;
  public BuiltinType!: Rule;
  public SequenceType!: Rule;
  public IntegerType!: Rule;
  public BooleanType!: Rule;
  public ObjectIdentifierType!: Rule;
  public CharacterStringType!: Rule;
  public RestrictedCharacterStringType!: Rule;
  public ComponentTypeLists!: Rule;
  public ComponentTypeList!: Rule;
  public ComponentType!: Rule;
  public NamedType!: Rule;

  addRule(name: string, implementation: (...implArgs: unknown[]) => unknown) {
    this.RULE(name, implementation);
  }

  addSubrule(rule: Rule) {
    this.SUBRULE(rule);
  }

  addConsume(token: TokenType) {
    this.CONSUME(token);
  }

  addOr(names: (keyof ASN1CstParser)[]) {
    const array = names.map(name => ({
      ALT: () => {
        this.SUBRULE(this[name] as (idx: number) => CstNode);
      },
    }));
    this.OR(array);
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
      this.addOr([
        'BooleanType',
        'ObjectIdentifierType',
        'CharacterStringType',
        'IntegerType',
        'SequenceType',
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
