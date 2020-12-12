// const {ASN1} = require('@jlguenego/asn1');
const {ASN1} = require('../../build/src');

const derMessage =
  '30 13 02 01 05 16 0e 41 6e 79 62 6f 64 79 20 74 68 65 72 65 3f';

// read from an ASN1 BER/CER/DER/JER/XER file raw content.
const message = ASN1.parseMsg(derMessage, {
  format: 'hex',
  encodingRule: 'DER',
});
// message is a JS object with ASN1 readable/understandable content
console.log('message: ', message);

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
        person    Person
    }

END
`;

const module = ASN1.getModuleFromStr(asn1ModuleStr);
const validatedMsg = module.validate(message, 'FooQuestion');

// validatedMsg is the same as message, but enriched with tagged names and types.
console.log('validatedMsg: ', validatedMsg);
