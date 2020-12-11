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

export interface ReferencedTypeCstNode extends CstNode {
  DefinedType?: CstNode;
  UsefulType?: CstNode;
}

export interface TypeCstNode extends CstNode {
  ConstrainedType?: CstNode;
  ReferencedType?: CstNode;
}

export interface BuiltinTypeCstNode extends CstNode {
  SequenceType: CstNode;
  BooleanType: CstNode;
  IntegerType: CstNode;
  CharacterStringType: CstNode;
  PrefixedType: CstNode;
}

export interface PrefixedTypeCstNode extends CstNode {
  TaggedType: CstNode;
}

export interface TaggedTypeCstNode extends CstNode {
  Tag: CstNode;
  Type: CstNode;
}

export interface TagCstNode extends CstNode {
  Class: CstNode;
  ClassNumber: CstNode;
}

export interface ClassCstNode extends CstNode {
  APPLICATION: CstNode;
}

export interface ClassNumberCstNode extends CstNode {
  Number: IToken[];
}

export interface DefinedTypeCstNode extends CstNode {
  TypeReference: IToken[];
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
