import assert from 'assert';
import {readFileSync} from 'fs';
import {resolve} from 'path';
import {ASN1} from '../src';

import {EncodingRule} from '../src/EncodingRule';

describe('JLG Protocol', () => {
  it('test JLGDER message', () => {
    const inputMsg = readFileSync(resolve(__dirname, 'data/jlg-test.der'), {
      encoding: 'utf8',
    });

    const output = ASN1.parseMsg(inputMsg, {
      encodingRule: EncodingRule.DER,
      format: 'hex',
    });
    assert.deepStrictEqual(output, {
      tagClass: 'UNIVERSAL',
      isConstructed: true,
      tagCode: 16,
      tagLabel: 'SEQUENCE',
      length: 14,
      lengthType: 'DEFINITE',
      value: [
        {
          tagClass: 'UNIVERSAL',
          isConstructed: false,
          tagCode: 1,
          tagLabel: 'BOOLEAN',
          length: 1,
          lengthType: 'DEFINITE',
          value: false,
        },
        {
          tagClass: 'UNIVERSAL',
          isConstructed: false,
          tagCode: 1,
          tagLabel: 'BOOLEAN',
          length: 1,
          lengthType: 'DEFINITE',
          value: true,
        },
        {
          tagClass: 'UNIVERSAL',
          isConstructed: true,
          tagCode: 16,
          tagLabel: 'SEQUENCE',
          length: 6,
          lengthType: 'DEFINITE',
          value: [
            {
              tagClass: 'UNIVERSAL',
              isConstructed: false,
              tagCode: 1,
              tagLabel: 'BOOLEAN',
              length: 1,
              lengthType: 'DEFINITE',
              value: true,
            },
            {
              tagClass: 'UNIVERSAL',
              isConstructed: false,
              tagCode: 1,
              tagLabel: 'BOOLEAN',
              length: 1,
              lengthType: 'DEFINITE',
              value: true,
            },
          ],
        },
      ],
    });
  });
});
