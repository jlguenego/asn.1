import assert from 'assert';
import {readFileSync} from 'fs';
import {resolve} from 'path';

import {asn1Parse} from '../src';
import {ASN1Validator} from '../src/ASN1Validator';
import {EncodingRule} from '../src/EncodingRule';
import fooQuestionDerJson from './data/foo-question.der.json';

describe('JLG Protocol', () => {
  it('test JLGDER message', () => {
    const inputMsg = readFileSync(resolve(__dirname, 'data/jlg-test.der'), {
      encoding: 'utf8',
    });
    const str = inputMsg
      .replace(/#.*/g, '')
      .replace(/ /g, '')
      .replace(/\r?\n|\r/g, '');
    const buf = Buffer.from(str, 'hex');
    const arrayBuffer = buf.buffer.slice(
      buf.byteOffset,
      buf.byteOffset + buf.byteLength
    );
    const output = asn1Parse(arrayBuffer, {
      encodingRule: EncodingRule.DER,
    });
    console.log('output: ', output);
    assert.deepStrictEqual(output, fooQuestionDerJson);
  });
});
