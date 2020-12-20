import {ASN1CstParser} from '../analysis/ASN1CstParser';
import {ASN1Lexer} from '../analysis/ASN1Lexer';
import {ASN1Visitor} from '../analysis/ASN1Visitor';
import {ASN1Module} from './ASN1Module';

export class ASN1ModuleFactory {
  static compile(definition: string): ASN1Module {
    const output = ASN1Lexer.tokenize(definition);
    const parserInstance = new ASN1CstParser();
    parserInstance.input = output.tokens;
    const cstOutput = parserInstance.ModuleDefinition();
    if (parserInstance.errors.length > 0) {
      throw Error('Syntax error:\n' + parserInstance.errors[0].message);
    }
    const toAstVisitorInstance = new ASN1Visitor();
    const ast = toAstVisitorInstance.visit(cstOutput);
    return ast;
  }
}
