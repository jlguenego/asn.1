import util from 'util';
import {ASN1AssignmentType} from '../asn1/ASN1AssignmentType';
import {ASN1Module} from '../asn1/ASN1Module';
import {ASN1CstParser} from './ASN1CstParser';
import {
  ASN1CstNode,
  ModuleIdentifierCstNode,
  TypeAssignmentCstNode,
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
    console.log('module: ', module);
    console.log('ctx: ', ctx);
    const name = ctx.TypeReference[0].image;
    const type: ASN1AssignmentType = new ASN1AssignmentType(name);
    module.addType(type);
  }
}
