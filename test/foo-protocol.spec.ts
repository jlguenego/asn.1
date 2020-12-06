import assert from 'assert';
import {readFileSync} from 'fs';
import {resolve} from 'path';

import {asn1Parse} from '../src';
import {ASN1Validator} from '../src/ASN1Validator';
import {EncodingRule} from '../src/EncodingRule';
import {ASN1Message} from '../src/interfaces/ASN1Message';
import {readEncodedFile} from '../src/misc';
import fooQuestionDerJson from './data/foo-question.der.json';

describe('Foo Unit Test', () => {
  it('should parse the foo message', () => {
    const output = asn1Parse(
      readEncodedFile(resolve(__dirname, 'data/foo-question.der')),
      {
        encodingRule: EncodingRule.DER,
      }
    );
    assert.deepStrictEqual(output, fooQuestionDerJson);
  });

  it('should validate the fooQuestionDerJson according the ASN1 FooProtocol', () => {
    const definition = readFileSync(
      resolve(__dirname, 'data/foo-protocol.asn1'),
      {encoding: 'utf8'}
    );
    const validator = new ASN1Validator(definition);
    validator.validate(
      fooQuestionDerJson as ASN1Message,
      ['FooQuestion'],
      EncodingRule.DER
    );
  });
});
