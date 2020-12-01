import assert from 'assert';
import util from 'util';
import {readFileSync} from 'fs';
import {resolve} from 'path';
import {ASN1Lexer} from '../src/analysis/ASN1Lexer';
import {ASN1CstParser} from '../src/analysis/ASN1CstParser';
import {ASN1Visitor} from '../src/analysis/ASN1Visitor';

describe('Lexer Unit Test', () => {
  it('should tokenize', () => {
    const input = readFileSync(
      resolve(__dirname, '../examples/messages/foo-protocol.asn1'),
      {encoding: 'utf8'}
    );

    // lexical analysis.
    const output = ASN1Lexer.tokenize(input);
    // console.log(
    //   'output: ',
    //   util.inspect(output, false, null, true /* enable colors */)
    // );
    // const expectedLength = 25;
    const expectedLength = output.tokens.length;
    assert.deepStrictEqual(output.tokens.length, expectedLength);

    // syntaxic analysis. (parser)
    const parserInstance = new ASN1CstParser();
    parserInstance.input = output.tokens;
    const cstOutput = parserInstance.ModuleDefinition();
    // console.log(
    //   'cstOutput: ',
    //   util.inspect(cstOutput, false, null, true /* enable colors */)
    // );
    if (parserInstance.errors.length > 0) {
      console.log(parserInstance.errors);
      throw Error('Syntax error:\n' + parserInstance.errors[0].message);
    }

    const toAstVisitorInstance = new ASN1Visitor();

    const ast = toAstVisitorInstance.visit(cstOutput);
    console.log(
      'ast: ',
      util.inspect(ast, false, null, true /* enable colors */)
    );
  });
});
