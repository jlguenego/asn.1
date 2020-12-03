import assert from 'assert';
import {readFileSync} from 'fs';
import {resolve} from 'path';

import {asn1Parse} from '../src';
import {ASN1Validator} from '../src/ASN1Validator';
import {EncodingRule} from '../src/EncodingRule';
import {sanitize} from '../src/misc';
import fooQuestionDerJson from './data/foo-question.der.json';

describe('Foo Unit Test', () => {
  it('should parse the foo message', () => {
    const inputMsg = readFileSync(resolve(__dirname, 'data/foo-question.der'), {
      encoding: 'utf8',
    });
    const buf = Buffer.from(sanitize(inputMsg), 'hex');
    const arrayBuffer = buf.buffer.slice(
      buf.byteOffset,
      buf.byteOffset + buf.byteLength
    );
    const output = asn1Parse(arrayBuffer, {
      encodingRule: EncodingRule.DER,
    });
    assert.deepStrictEqual(output, fooQuestionDerJson);
  });

  it('should validate the fooQuestionDerJson according the ASN1 FooProtocol', () => {
    const definition = readFileSync(
      resolve(__dirname, 'data/foo-protocol.asn1'),
      {encoding: 'utf8'}
    );
    const validator = new ASN1Validator(definition);
    validator.validate(fooQuestionDerJson, ['FooQuestion'], EncodingRule.DER);
  });
});
