import assert from 'assert';
import {readFileSync} from 'fs';
import {resolve} from 'path';
import {ASN1Lexer} from '../src/analysis/ASN1Lexer';

describe('Lexer Unit Test', () => {
  it('should tokenize', () => {
    const input = readFileSync(
      resolve(__dirname, '../examples/messages/foo-protocol.asn1'),
      {encoding: 'utf8'}
    );
    const output = ASN1Lexer.tokenize(input);
    const expectedLength = 25;
    assert.deepStrictEqual(output.tokens.length, expectedLength);
  });
});
