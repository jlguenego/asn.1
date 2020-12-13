import assert from 'assert';
import {readFileSync} from 'fs';
import {resolve} from 'path';

import {ASN1, EncodingRule, sanitize} from '../src';

describe('Generate Test', () => {
  it('should generate a message', () => {
    // ASN1 module definition parser.
    const asn1ModuleStr = `
HelloProtocol DEFINITIONS ::= BEGIN

    Person ::= SEQUENCE {
        lastname           GeneralString,
        firstname          GeneralString,
        likeCoding     BOOLEAN
    }

    WelcomeMsg ::= SEQUENCE {
        id        INTEGER,
        someone   Person
    }

END
`;

    const data = {
      id: 34,
      someone: {
        lastname: 'GUENEGO',
        firstname: 'Jean-Louis',
        likeCoding: true,
      },
    };

    const asn1Module = ASN1.getModuleFromStr(asn1ModuleStr);
    const buffer = asn1Module.generate('WelcomeMsg', data, {
      encodingRule: EncodingRule.DER,
    });
    const messageHex = buffer.toString('hex');
    const expectedMessageHex = sanitize(
      readFileSync(resolve(__dirname, 'data/hello-jlg.der'), {
        encoding: 'utf8',
      })
    );
    assert.deepStrictEqual(messageHex, expectedMessageHex);
  });
});
