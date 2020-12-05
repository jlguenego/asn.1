import assert from 'assert';
import {readFileSync} from 'fs';
import {resolve} from 'path';

import {asn1Parse} from '../src';
import {EncodingRule} from '../src/EncodingRule';
import {sanitize} from '../src/misc';

describe('JLG Protocol', () => {
  it('test JLGDER message', () => {
    const inputMsg = readFileSync(resolve(__dirname, 'data/jlg-test.der'), {
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
    assert.deepStrictEqual(output, {
      '0': false,
      '1': true,
      '2': {'0': true, '1': true},
    });
  });
});
