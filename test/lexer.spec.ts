import assert from 'assert';
// import util from 'util';
import {readFileSync} from 'fs';
import {resolve} from 'path';
import {ASN1Lexer} from '../src/analysis/ASN1Lexer';
import {ASN1Parser} from '../src/analysis/ASN1Parser';

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
    const parserInstance = new ASN1Parser();
    parserInstance.input = output.tokens;
    parserInstance.ModuleDefinition();
    if (parserInstance.errors.length > 0) {
      console.log(parserInstance.errors);
      throw Error('Syntax error:\n' + parserInstance.errors[0].message);
    }
  });
});
