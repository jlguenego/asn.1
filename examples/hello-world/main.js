// const {ASN1} = require('@jlguenego/asn1');
const {ASN1} = require('../../build/src');
const {inspect} = require('util');
const {EncodingRule} = require('../../build/src/EncodingRule');

const derMessage = `
30 # Sequence constructed (WelcomeMsg)
  1D # Length (29)
    02 # Type Integer (id)
      01 # Length 1
        12 # 0x12 = 18
    30 # Sequence constructed (someone)
      18 # Length (24)
        1B # Type GeneralString (lastname)
          07 # Length (7)
            47 55 45 4E 45 47 4F # value: GUENEGO
        1B # Type GeneralString (firstname)
          0A # Length (10)
            4A 65 61 6E 2D 4C 6F 75 69 73 # value: Jean-Louis
        01 # Type BOOLEAN (likeCoding)
          01 # Length (1)
            FF # TRUE
`;

// read from an ASN1 BER/CER/DER/JER/XER file raw content.
const message = ASN1.parseMsg(derMessage, {
  format: 'hex',
  encodingRule: 'DER',
});
// message is a JS object with ASN1 readable/understandable content
console.log('message: ', inspect(message, false, null, true));

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

const asn1Module = ASN1.getModuleFromStr(asn1ModuleStr);
const validatedMsg = asn1Module.validate(message, 'WelcomeMsg');

// validatedMsg is the same as message, but enriched with tagged names and types.
console.log('validatedMsg: ', inspect(validatedMsg, false, null, true));

const data = {
  id: 18,
  someone: {
    lastname: 'GUENEGO',
    firstname: 'Suzana',
    likeCoding: false,
  },
};

// regenerate the original DER message.
const derBuffer = asn1Module.generate('WelcomeMsg', data, {
  encodingRule: EncodingRule.DER,
});
console.log('derMessage: ', derBuffer.toString('hex'));
