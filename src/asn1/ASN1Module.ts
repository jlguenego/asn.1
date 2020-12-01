import {ASN1Lexer} from '../analysis/ASN1Lexer';
import {ASN1CstParser} from '../analysis/ASN1CstParser';
import {ASN1AssignmentType} from './ASN1AssignmentType';
import {ASN1Visitor} from '../analysis/ASN1Visitor';

export class ASN1Module {
  static compile(definition: string): ASN1Module {
    const output = ASN1Lexer.tokenize(definition);
    const parserInstance = new ASN1CstParser();
    parserInstance.input = output.tokens;
    const cstOutput = parserInstance.ModuleDefinition();
    if (parserInstance.errors.length > 0) {
      console.log(parserInstance.errors);
      throw Error('Syntax error:\n' + parserInstance.errors[0].message);
    }
    const toAstVisitorInstance = new ASN1Visitor();
    const ast = toAstVisitorInstance.visit(cstOutput);
    return ast;
  }

  ctypes: ASN1AssignmentType[] = [];
  constructor(public name: string) {
    this.ctypes = [];
  }

  addType(type: ASN1AssignmentType) {
    this.ctypes.push(type);
  }

  getDefaultType(): string {
    if (this.ctypes.length === 0) {
      throw new Error('Cannot get the default type of an empty def file');
    }
    return this.ctypes[0].name;
  }
}
