import assert from 'assert';
import {readFileSync} from 'fs';
import {resolve} from 'path';
import {inspect} from 'util';
import dbg from 'debug';

import kerberosJson from './data/kerberos.json';
import kerberosValidatedJson from './data/kerberos.validated.json';
import krbApRepJson from './data/kerberos/krb-ap-rep.json';
import krbApRepValidatedJson from './data/kerberos/krb-ap-rep.validated.json';
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
    // console.log('module: ', inspect(module, false, null, true));
    const validated = module.validate(kerberosJson as ASN1Message, 'GSS-API');
    // console.log('validated: ', inspect(validated, false, null, true));
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

  it('test kerberos AP-REP msg', () => {
    const output = ASN1.parseFileMsg(
      resolve(__dirname, 'data/kerberos/krb-ap-rep.base64.der'),
      {
        encodingRule: EncodingRule.DER,
        format: 'base64',
      }
    );
    debug('output: ', inspect(output, false, null, true));

    assert.deepStrictEqual(output, krbApRepJson);
  });

  it('validate AP-REP', () => {
    const definition = readFileSync(resolve(__dirname, 'data/kerberos.asn1'), {
      encoding: 'utf8',
    });
    const module = ASN1.getModuleFromStr(definition);
    const validated = module.validate(krbApRepJson as ASN1Message, 'GSS-API');
    // console.log('validated: ', inspect(validated, false, null, true));
    assert.deepStrictEqual(validated, krbApRepValidatedJson);
  });
});
