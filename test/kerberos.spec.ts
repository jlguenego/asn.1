import assert from 'assert';
import {readFileSync} from 'fs';
import {resolve} from 'path';

import kerberosJson from './data/kerberos/krb-ap-req.json';
import kerberosValidatedJson from './data/kerberos/krb-ap-req.validated.json';
import krbApRepJson from './data/kerberos/krb-ap-rep.json';
import krbApRepValidatedJson from './data/kerberos/krb-ap-rep.validated.json';
import {ASN1, ASN1Message, ASN1MsgUtils, EncodingRule, sanitize} from '../src';
import {ASN1Node} from '../src/node/ASN1Node';
import {ASN1MessageFormat} from '../src/interfaces/ASN1MessageFormat';

describe('Kerberos Protocol', () => {
  it('test hex base64 conv', () => {
    const base64Msg = readFileSync(
      resolve(__dirname, 'data/kerberos/krb-ap-req.base64.der'),
      {
        encoding: 'utf8',
      }
    );
    const hexMsg = readFileSync(
      resolve(__dirname, 'data/kerberos/krb-ap-req.hex.der'),
      {
        encoding: 'utf8',
      }
    );

    const buf = Buffer.from(sanitize(base64Msg), 'base64').toString('hex');
    assert.deepStrictEqual(buf, sanitize(hexMsg));
  });

  it('test kerberos AP-REQ msg', () => {
    const output = ASN1Node.parseFileMsg(
      resolve(__dirname, 'data/kerberos/krb-ap-req.hex.der'),
      {
        encodingRule: EncodingRule.DER,
      }
    );
    assert.deepStrictEqual(output, kerberosJson);
  });

  it('test kerberos asn.1 file from the RFC4120', () => {
    const definition = readFileSync(
      resolve(__dirname, 'data/kerberos/kerberos.asn1'),
      {
        encoding: 'utf8',
      }
    );
    const module = ASN1.getModuleFromStr(definition);
    // console.log('module: ', inspect(module, false, null, true));
    const validated = ASN1.validate(
      module,
      kerberosJson as ASN1Message,
      'GSS-API'
    );
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
    const output = ASN1Node.parseFileMsg(
      resolve(__dirname, 'data/kerberos/krb-ap-rep.base64.der'),
      {
        encodingRule: EncodingRule.DER,
        format: ASN1MessageFormat.BASE64,
      }
    );
    assert.deepStrictEqual(output, krbApRepJson);
  });

  it('validate AP-REP', () => {
    const definition = readFileSync(
      resolve(__dirname, 'data/kerberos/kerberos.asn1'),
      {
        encoding: 'utf8',
      }
    );
    const module = ASN1.getModuleFromStr(definition);
    const validated = ASN1.validate(
      module,
      krbApRepJson as ASN1Message,
      'GSS-API'
    );
    // console.log('validated: ', inspect(validated, false, null, true));
    assert.deepStrictEqual(validated, krbApRepValidatedJson);
  });
});
