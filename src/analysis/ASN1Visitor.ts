// import {inspect} from 'util';
import {ASN1Assignment} from '../asn1/ASN1Assignment';
import {ASN1DefinedType} from '../asn1/ASN1DefinedType';
import {ASN1Module} from '../asn1/ASN1Module';
import {ASN1NamedType} from '../asn1/ASN1NamedType';
import {ASN1Sequence} from '../asn1/ASN1Sequence';
import {ASN1Choice} from '../asn1/ASN1Choice';
import {ASN1Tag} from '../asn1/ASN1Tag';
import {ASN1TaggedType} from '../asn1/ASN1TaggedType';
import {ASN1Type} from '../asn1/ASN1Type';
import {
  ASN1BooleanType,
  ASN1GeneralStringType,
  ASN1IA5StringType,
  ASN1IntegerType,
} from '../asn1/types/builtin';
import {TagClass} from '../interfaces/TagClass';
import {ASN1CstParser} from './ASN1CstParser';
import {
  ASN1CstNode,
  ModuleIdentifierCstNode,
  TypeAssignmentCstNode,
  TypeCstNode,
  SequenceTypeCstNode,
  BuiltinTypeCstNode,
  NamedTypeCstNode,
  ComponentTypeCstNode,
  CharacterStringTypeCstNode,
  ConstrainedTypeCstNode,
  PrefixedTypeCstNode,
  TaggedTypeCstNode,
  TagCstNode,
  ClassCstNode,
  ClassNumberCstNode,
  DefinedTypeCstNode,
  ReferencedTypeCstNode,
  RestrictedCharacterStringTypeCstNode,
  ChoiceTypeCstNode,
  AlternativeTypeListCstNode,
} from './interfaces';

const parserInstance = new ASN1CstParser();
// The base visitor class can be accessed via the a parser instance.
// const BaseASN1Visitor = parserInstance.getBaseCstVisitorConstructor();
const BaseASN1VisitorWithDefaults = parserInstance.getBaseCstVisitorConstructorWithDefaults();

export class ASN1Visitor extends BaseASN1VisitorWithDefaults {
  constructor() {
    super();
    this.validateVisitor();
  }

  ModuleDefinition(ctx: ASN1CstNode): ASN1Module {
    const name = this.visit(ctx.ModuleIdentifier);
    const module = new ASN1Module(name);
    this.visit(ctx.ModuleBody, module);
    return module;
  }

  ModuleIdentifier(ctx: ModuleIdentifierCstNode) {
    const name = ctx.TypeReference[0].image;
    return name;
  }

  TypeAssignment(ctx: TypeAssignmentCstNode, module: ASN1Module) {
    const name = ctx.TypeReference[0].image;
    const assignment = new ASN1Assignment(name);
    const type = this.visit(ctx.Type);
    assignment.setType(type);
    module.addAssignment(assignment);
  }

  Type(ctx: TypeCstNode) {
    if (ctx.ConstrainedType) {
      return this.visit(ctx.ConstrainedType);
    }
    if (ctx.ReferencedType) {
      return this.visit(ctx.ReferencedType);
    }
  }

  ConstrainedType(ctx: ConstrainedTypeCstNode) {
    return this.visit(ctx.BuiltinType);
  }

  ReferencedType(ctx: ReferencedTypeCstNode) {
    if (ctx.DefinedType) {
      return this.visit(ctx.DefinedType);
    }
    if (ctx.UsefulType) {
      return this.visit(ctx.UsefulType);
    }
  }

  BuiltinType(ctx: BuiltinTypeCstNode) {
    if (ctx.PrefixedType) {
      return this.visit(ctx.PrefixedType);
    }
    if (ctx.SequenceType) {
      return this.visit(ctx.SequenceType);
    }
    if (ctx.BooleanType) {
      return new ASN1BooleanType();
    }
    if (ctx.IntegerType) {
      return new ASN1IntegerType();
    }
    if (ctx.CharacterStringType) {
      return this.visit(ctx.CharacterStringType);
    }
    if (ctx.ChoiceType) {
      return this.visit(ctx.ChoiceType);
    }
    return null;
  }

  PrefixedType(ctx: PrefixedTypeCstNode) {
    return this.visit(ctx.TaggedType);
  }

  TaggedType(ctx: TaggedTypeCstNode) {
    const tag = this.visit(ctx.Tag) as ASN1Tag;
    const type = this.visit(ctx.Type) as ASN1Type;
    const isImplicit = ctx.IMPLICIT ? true : false;
    return new ASN1TaggedType(tag, type, isImplicit);
  }

  Tag(ctx: TagCstNode) {
    const tagClass = this.visit(ctx.Class) as TagClass;
    const tagCode = this.visit(ctx.ClassNumber) as number;
    return new ASN1Tag(tagClass, tagCode);
  }

  Class(ctx: ClassCstNode) {
    if (ctx.APPLICATION) {
      return TagClass.APPLICATION;
    }
    return TagClass.CONTEXT_SPECIFIC;
  }

  ClassNumber(ctx: ClassNumberCstNode) {
    return +ctx.Number[0].image;
  }

  DefinedType(ctx: DefinedTypeCstNode) {
    const name = ctx.TypeReference[0].image;
    return new ASN1DefinedType(name);
  }

  SequenceType(ctx: SequenceTypeCstNode) {
    const sequence = new ASN1Sequence();
    this.visit(ctx.ComponentTypeLists, sequence);
    return sequence;
  }

  ComponentType(ctx: ComponentTypeCstNode, sequence: ASN1Sequence) {
    const namedType = this.visit(ctx.NamedType) as ASN1NamedType;
    if (ctx.OPTIONAL) {
      namedType.optional = true;
    }
    sequence.addComponent(namedType);
  }

  ChoiceType(ctx: ChoiceTypeCstNode) {
    const choice = new ASN1Choice();
    this.visit(ctx.AlternativeTypeLists, choice);
    return choice;
  }

  AlternativeTypeList(ctx: AlternativeTypeListCstNode, choice: ASN1Choice) {
    const namedType = this.visit(ctx.NamedType) as ASN1NamedType;
    choice.addAlternative(namedType);
  }

  NamedType(ctx: NamedTypeCstNode) {
    const name = ctx.Identifier[0].image;
    const type = this.visit(ctx.Type);
    const namedType = new ASN1NamedType(name, type);
    return namedType;
  }

  CharacterStringType(ctx: CharacterStringTypeCstNode) {
    return this.visit(ctx.RestrictedCharacterStringType);
  }

  RestrictedCharacterStringType(ctx: RestrictedCharacterStringTypeCstNode) {
    if (ctx.IA5String) {
      return new ASN1IA5StringType();
    }
    if (ctx.GeneralString) {
      return new ASN1GeneralStringType();
    }
    return new ASN1IA5StringType();
  }
}
