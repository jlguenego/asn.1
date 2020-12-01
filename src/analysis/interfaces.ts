import {CstNode, IToken} from 'chevrotain';

export interface ASN1CstNode {
  ModuleIdentifier: ModuleIdentifierCstNode;
  ModuleBody: CstNode;
}

export interface ModuleIdentifierCstNode extends CstNode {
  TypeReference: IToken[];
}

export interface TypeAssignmentCstNode extends CstNode {
  TypeReference: IToken[];
  Type: TypeCstNode;
}

export interface TypeCstNode extends CstNode {
  BuiltinType: CstNode;
}

export interface BuiltinTypeCstNode extends CstNode {
  SequenceType: CstNode;
}

export interface SequenceTypeCstNode extends CstNode {
  ComponentTypeLists: CstNode;
}

export interface ComponentTypeCstNode extends CstNode {
  NamedType: CstNode;
}

export interface NamedTypeCstNode extends CstNode {
  Type: CstNode;
}
