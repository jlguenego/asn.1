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
}
