import {CstNode, CstParser, TokenType} from 'chevrotain';
import {Rule} from '../interfaces/Rule';

import {
  AFFECTATION,
  BEGIN,
  DEFINITIONS,
  END,
  EXPLICIT,
  TAGS,
  IMPLICIT,
  AUTOMATIC,
  allASN1Tokens,
} from './ASN1Lexer';
import {initBuiltinTypeRules} from './parser/BuiltinTypeRules';
import {initBuiltinValueRules} from './parser/BuiltinValueRules';
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

  public BitStringType!: Rule;
  public BooleanType!: Rule;
  public OctetStringType!: Rule;
  public SequenceType!: Rule;
  public SequenceOfType!: Rule;

  public IntegerType!: Rule;
  public NamedNumberList!: Rule;
  public NamedNumber!: Rule;
  public SignedNumber!: Rule;
  public DefinedValue!: Rule;

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
        this.addOrTokenList([EXPLICIT, IMPLICIT, AUTOMATIC]);
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
      this.addOrList(['TypeAssignment', 'ValueAssignment']);
    });

    initModuleIdentifierRules.call(this);
    initBuiltinValueRules.call(this);
    initBuiltinTypeRules.call(this);
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
