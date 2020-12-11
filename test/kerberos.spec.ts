import assert from 'assert';
import {readFileSync} from 'fs';
import {resolve} from 'path';
import {inspect} from 'util';
import dbg from 'debug';

import {asn1Parse} from '../src';
import {EncodingRule} from '../src/EncodingRule';
import {readEncodedFile, sanitize} from '../src/misc';
import kerberosJson from './data/kerberos.json';
import kerberosValidatedJson from './data/kerberos.validated.json';
import {ASN1Validator} from '../src/ASN1Validator';
import {ASN1Message} from '../src/interfaces/ASN1Message';
// import {ASN1MsgUtils} from '../src/ASN1MsgUtils';

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
    const output = asn1Parse(
      readEncodedFile(resolve(__dirname, 'data/kerberos.hex.der')),
      {
        encodingRule: EncodingRule.DER,
      }
    );
    debug('output: ', inspect(output, false, null, true));

    assert.deepStrictEqual(output, kerberosJson);
  });

  it('test kerberos asn.1 file from the RFC4120', () => {
    const definition = readFileSync(resolve(__dirname, 'data/kerberos.asn1'), {
      encoding: 'utf8',
    });
    const validator = new ASN1Validator(definition);
    validator.validate(kerberosJson.value[2] as ASN1Message, 'AP-REQ');
    // console.log(
    //   'kerberosJson.value[2]: ',
    //   inspect(kerberosJson.value[2], false, null, true)
    // );
    assert.deepStrictEqual(kerberosJson.value[2], kerberosValidatedJson);
  });

  // it('get the PrincipalName', () => {
  //   const principalNameMsg = ASN1MsgUtils.query(
  //     kerberosValidatedJson as ASN1Message,
  //     'tagName',
  //     'name-string'
  //   ) as ASN1Message;
  //   console.log(
  //     'principalNameMsg: ',
  //     inspect(principalNameMsg, false, null, true)
  //   );
  //   const serviceName = (principalNameMsg.value as ASN1Message[])[0].value[0]
  //     .value;
  //   const principalName = serviceName + '/' + hostname;
  //   // assert.deepStrictEqual(principalName, 'HTTP/localhost');
  // });
});
