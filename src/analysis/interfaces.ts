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

export interface ConstrainedTypeCstNode extends CstNode {
  BuiltinType: CstNode;
}

export interface TypeCstNode extends CstNode {
  ConstrainedType: CstNode;
}

export interface BuiltinTypeCstNode extends CstNode {
  SequenceType: CstNode;
  BooleanType: CstNode;
  IntegerType: CstNode;
  CharacterStringType: CstNode;
}

export interface SequenceTypeCstNode extends CstNode {
  ComponentTypeLists: CstNode;
}

export interface ComponentTypeCstNode extends CstNode {
  NamedType: CstNode;
}

export interface NamedTypeCstNode extends CstNode {
  Identifier: IToken[];
  Type: CstNode;
}

export interface CharacterStringTypeCstNode extends CstNode {
  RestrictedCharacterStringType: CstNode;
}

export interface RestrictedCharacterStringTypeCstNode extends CstNode {
  IA5String: IToken[];
}
