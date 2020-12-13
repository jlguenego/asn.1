import assert from 'assert';
import {readFileSync} from 'fs';
import {resolve} from 'path';
import {inspect} from 'util';
import dbg from 'debug';

import kerberosJson from './data/kerberos.json';
import kerberosValidatedJson from './data/kerberos.validated.json';
import {ASN1, ASN1Message, ASN1MsgUtils, EncodingRule, sanitize} from '../src';

const debug = dbg('asn.1:test');

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
    const output = ASN1.parseFileMsg(
      resolve(__dirname, 'data/kerberos.hex.der'),
      {
        encodingRule: EncodingRule.DER,
        format: 'hex',
      }
    );
    debug('output: ', inspect(output, false, null, true));

    assert.deepStrictEqual(output, kerberosJson);
  });

  it('test kerberos asn.1 file from the RFC4120', () => {
    const definition = readFileSync(resolve(__dirname, 'data/kerberos.asn1'), {
      encoding: 'utf8',
    });
    const module = ASN1.getModuleFromStr(definition);
    const validated = module.validate(kerberosJson as ASN1Message, 'GSS-API');
    assert.deepStrictEqual(validated, kerberosValidatedJson);
  });

  it('get the PrincipalName', () => {
    const generalStrings = ASN1MsgUtils.queryAll(
      kerberosJson as ASN1Message,
      'tagLabel',
      'GeneralString'
    );

    const principalName = generalStrings
      .map(v => v.value)
      .slice(1)
      .join('/');
    assert.deepStrictEqual(principalName, 'HTTP/localhost');
  });
});
