import util from 'util';
import {ASN1Assignment} from '../asn1/ASN1Assignment';
import {ASN1Module} from '../asn1/ASN1Module';
import {ASN1NamedType} from '../asn1/ASN1NamedType';
import {ASN1Sequence} from '../asn1/ASN1Sequence';
import {
  ASN1BooleanType,
  ASN1IA5StringType,
  ASN1IntegerType,
} from '../asn1/types/builtin';
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
    console.log('ctx: ', util.inspect(ctx, false, null, true));
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
    // console.log('ctx: ', util.inspect(ctx, false, null, true));
    const name = ctx.TypeReference[0].image;
    const assignment = new ASN1Assignment(name);
    const type = this.visit(ctx.Type, assignment);
    assignment.setType(type);
    module.addAssignment(assignment);
  }

  Type(ctx: TypeCstNode) {
    return this.visit(ctx.BuiltinType);
  }

  BuiltinType(ctx: BuiltinTypeCstNode) {
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
    return null;
  }

  SequenceType(ctx: SequenceTypeCstNode) {
    console.log('ctx: ', util.inspect(ctx, false, null, true));
    const sequence = new ASN1Sequence();
    this.visit(ctx.ComponentTypeLists, sequence);
    return sequence;
  }

  ComponentType(ctx: ComponentTypeCstNode, sequence: ASN1Sequence) {
    const namedType = this.visit(ctx.NamedType);
    sequence.addComponent(namedType);
  }

  NamedType(ctx: NamedTypeCstNode) {
    console.log('ctx NamedType: ', util.inspect(ctx, false, null, true));
    const name = ctx.Identifier[0].image;
    const type = this.visit(ctx.Type);
    const namedType = new ASN1NamedType(name, type);
    return namedType;
  }

  CharacterStringType(ctx: CharacterStringTypeCstNode) {
    return this.visit(ctx.RestrictedCharacterStringType);
  }

  RestrictedCharacterStringType() {
    return new ASN1IA5StringType();
  }
}
