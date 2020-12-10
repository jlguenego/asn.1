import {CstNode, GrammarAction, IOrAlt, TokenType} from 'chevrotain';
import {Rule} from '../interfaces/Rule';

import {
  AFFECTATION,
  BEGIN,
  DEFINITIONS,
  END,
  Identifier,
  TypeReference,
  IA5String,
  UTF8String,
  BOOLEAN,
  EXPLICIT,
  TAGS,
  IMPLICIT,
  AUTOMATIC,
  OBJECT,
  IDENTIFIER,
  NumberToken,
  NegativeNumberToken,
  GeneralString,
} from './ASN1Lexer';
import {initConstrainedTypeRules} from './parser/ASN1ConstrainedTypeRules';
import {initIntegerTypeRules} from './parser/ASN1IntegerTypeRules';
import {ASN1ModuleIdentifierCstParser} from './parser/ASN1ModuleIdentifierCstParser';
import {initObjectIdentifierValueRules} from './parser/ASN1ObjectIdentifierValueRules';
import {initSequenceTypeRules} from './parser/ASN1SequenceTypeRules';

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
  public IntegerValue!: Rule;
  public ObjectIdentifierValue!: Rule;
  public ObjIdComponentsList!: Rule;
  public ObjIdComponents!: Rule;
  public NameAndNumberForm!: Rule;
  public NumberForm!: Rule;
  public Type!: Rule;
  public BuiltinType!: Rule;

  public ConstrainedType!: Rule;
  public Constraint!: Rule;
  public TypeWithConstraint!: Rule;
  public ConstraintSpec!: Rule;
  public ExceptionSpec!: Rule;
  public SubtypeConstraint!: Rule;
  public ElementSetSpecs!: Rule;
  public SubtypeElements!: Rule;
  public GeneralConstraint!: Rule;
  public ValueRange!: Rule;
  public LowerEndpoint!: Rule;
  public UpperEndpoint!: Rule;
  public LowerEndValue!: Rule;
  public UpperEndValue!: Rule;

  public SequenceType!: Rule;
  public IntegerType!: Rule;
  public NamedNumberList!: Rule;
  public NamedNumber!: Rule;
  public SignedNumber!: Rule;
  public DefinedValue!: Rule;
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

  addOr(altsOrOpts: IOrAlt<void>[]) {
    this.OR(altsOrOpts);
  }

  addOption(actionORMethodDef: GrammarAction<void>) {
    this.OPTION(actionORMethodDef);
  }

  addMany(actionORMethodDef: GrammarAction<void>) {
    this.MANY(actionORMethodDef);
  }

  addOrList(names: (keyof ASN1CstParser)[]) {
    const array = names.map(name => ({
      ALT: () => {
        this.SUBRULE(this[name] as (idx: number) => CstNode);
      },
    }));
    this.OR(array);
  }

  addOrTokenList(tokens: TokenType[]) {
    const array = tokens.map(t => ({
      ALT: () => {
        this.CONSUME(t);
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
      this.addOrList(['ObjectIdentifierValue', 'IntegerValue']);
    });

    this.RULE('IntegerValue', () => {
      this.addOrTokenList([Identifier, NumberToken, NegativeNumberToken]);
    });

    this.RULE('TypeAssignment', () => {
      // 16.1
      this.CONSUME(TypeReference);
      this.CONSUME(AFFECTATION);
      this.SUBRULE(this.Type);
    });

    this.RULE('Type', () => {
      this.addOrList(['ConstrainedType']);
    });

    this.RULE('BuiltinType', () => {
      this.addOrList([
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
            this.CONSUME(GeneralString);
          },
        },
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

    this.RULE('DefinedValue', () => {
      this.addOrList(['ValueReference']);
    });

    initConstrainedTypeRules(this);
    initIntegerTypeRules(this);
    initObjectIdentifierValueRules(this);
    initSequenceTypeRules(this);
    this.performSelfAnalysis();
  }
}
