import assert from 'assert';

import {asn1Parse} from '../src';
import {EncodingRule} from '../src/EncodingRule';

describe('Base64 Unit Test', () => {
  it('should parse the foo protocol', () => {
    const inputMsg =
      '30 13 02 01 05 16 0e 41 6e 79 62 6f 64 79 20 74 68 65 72 65 3f';
    const buf = Buffer.from(inputMsg.replace(/ /g, ''), 'hex');
    const arrayBuffer = buf.buffer.slice(
      buf.byteOffset,
      buf.byteOffset + buf.byteLength
    );
    const output = asn1Parse(arrayBuffer, {
      encodingRule: EncodingRule.DER,
    });
    assert.deepStrictEqual(output, {
      trackingNumber: '5',
      question: 'Anybody there?',
    });
  });
});
