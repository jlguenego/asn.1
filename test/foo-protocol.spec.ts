import assert from 'assert';
import {readFileSync} from 'fs';
import {resolve} from 'path';
import {ASN1, EncodingRule, ASN1Message} from '../src';

import fooQuestionDerJson from './data/foo-question.der.json';
import fooQuestionDerValidatedJson from './data/foo-question.validated.der.json';

describe('Foo Unit Test', () => {
  it('should parse the foo message', () => {
    const output = ASN1.decode(
      readFileSync(resolve(__dirname, 'data/foo-question.der'), {
        encoding: 'utf8',
      }),
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
    const module = ASN1.getModuleFromStr(definition);
    const validatedJson = ASN1.validate(
      module,
      fooQuestionDerJson as ASN1Message,
      'FooQuestion'
    );
    assert.deepStrictEqual(validatedJson, fooQuestionDerValidatedJson);
  });
});
