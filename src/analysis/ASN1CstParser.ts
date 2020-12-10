import {CstNode, CstParser, TokenType} from 'chevrotain';
import {Rule} from '../interfaces/Rule';

import {
  AFFECTATION,
  BEGIN,
  DEFINITIONS,
  END,
  Identifier,
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
  allASN1Tokens,
} from './ASN1Lexer';
import {initConstrainedTypeRules} from './parser/ConstrainedTypeRules';
import {initIntegerTypeRules} from './parser/IntegerTypeRules';
import {initModuleIdentifierRules} from './parser/ModuleIdentifierRules';
import {initObjectIdentifierValueRules} from './parser/ObjectIdentifierValueRules';
import {initReferencedTypeRules} from './parser/ReferencedTypeRules';
import {initSequenceOfTypeRules} from './parser/SequenceOfTypeRules';
import {initSequenceTypeRules} from './parser/SequenceTypeRules';
import {initTaggedTypeRules} from './parser/TaggedTypeRules';
import {initTypeRules} from './parser/TypeRules';

export class ASN1CstParser extends CstParser {
  public ModuleDefinition!: Rule;

  public ModuleIdentifier!: () => CstNode;
  public DefinitiveIdentification!: () => CstNode;
  public DefinitiveOID!: () => CstNode;
  public DefinitiveObjIdComponentList!: () => CstNode;
  public DefinitiveObjIdComponent!: () => CstNode;
  public DefinitiveNameAndNumberForm!: () => CstNode;

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
  public ConstrainedType!: Rule;
  public ReferencedType!: Rule;

  public DefinedType!: Rule;

  public TaggedType!: Rule;
  public Tag!: Rule;
  public ClassNumber!: Rule;

  public BuiltinType!: Rule;
  public PrefixedType!: Rule;

  public Constraint!: Rule;
  public TypeWithConstraint!: Rule;
  public ConstraintSpec!: Rule;
  public ExceptionSpec!: Rule;
  public SubtypeConstraint!: Rule;
  public ElementSetSpecs!: Rule;
  public RootElementSetSpec!: Rule;
  public ElementSetSpec!: Rule;
  public Elements!: Rule;
  public SubtypeElements!: Rule;
  public ContainedSubType!: Rule;
  public GeneralConstraint!: Rule;
  public ValueRange!: Rule;
  public LowerEndpoint!: Rule;
  public UpperEndpoint!: Rule;
  public LowerEndValue!: Rule;
  public UpperEndValue!: Rule;

  public SequenceType!: Rule;
  public SequenceOfType!: Rule;

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
    super(allASN1Tokens);

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

    initModuleIdentifierRules.call(this);
    initConstrainedTypeRules.call(this);
    initIntegerTypeRules.call(this);
    initObjectIdentifierValueRules.call(this);
    initSequenceTypeRules.call(this);
    initSequenceOfTypeRules.call(this);
    initTypeRules.call(this);
    initReferencedTypeRules.call(this);
    initTaggedTypeRules.call(this);
    this.performSelfAnalysis();
  }
}
