import assert from 'assert';
import {readFileSync} from 'fs';
import {resolve} from 'path';

import {asn1Parse} from '../src';
import {EncodingRule} from '../src/EncodingRule';
import {readEncodedFile, sanitize} from '../src/misc';
import kerberosJson from './data/kerberos.json';

describe('Kerberos Protocol', () => {
  it('test hex base64 conv', () => {
    const base64Msg = readFileSync(
      resolve(__dirname, 'data/kerberos.base64.der'),
      {
        encoding: 'utf8',
      }
    );
    const hexMsg = readFileSync(resolve(__dirname, 'data/kerberos.hex.der'), {
      encoding: 'utf8',
    });

    const buf = Buffer.from(sanitize(base64Msg), 'base64').toString('hex');
    assert.deepStrictEqual(buf, sanitize(hexMsg));
  });

  it('test kerberos AP-REQ msg', () => {
    const output = asn1Parse(
      readEncodedFile(resolve(__dirname, 'data/kerberos.hex.der')),
      {
        encodingRule: EncodingRule.DER,
      }
    );

    assert.deepStrictEqual(output, kerberosJson);
  });
});
