import assert from 'assert';
// import util from 'util';
import {readFileSync} from 'fs';
import {resolve} from 'path';
import {ASN1CstParser, ASN1Lexer, ASN1Module, ASN1Visitor} from '../src';

describe('Lexer Unit Test', () => {
  it('should tokenize', () => {
    const input = readFileSync(resolve(__dirname, 'data/foo-protocol.asn1'), {
      encoding: 'utf8',
    });

    // lexical analysis.
    const output = ASN1Lexer.tokenize(input);

    // syntaxic analysis. (parser)
    const parserInstance = new ASN1CstParser();
    parserInstance.input = output.tokens;
    const cstOutput = parserInstance.ModuleDefinition();
    if (parserInstance.errors.length > 0) {
      console.error(parserInstance.errors);
      throw Error('Syntax error:\n' + parserInstance.errors[0].message);
    }

    const toAstVisitorInstance = new ASN1Visitor();

    const module = toAstVisitorInstance.visit(cstOutput) as ASN1Module;
    assert.strictEqual(module.name, 'FooProtocol');
  });
});
