# ASN.1

A complete ASN1 tool set for Node.

- ASN1 BER/CER/DER message parser.
- ASN1 Module file compiler
- ASN1 message validation

## Install

```
npm i -g @jlguenego/asn.1
```

## Usage

### Javascript

```js
const {ASN1} = require('@jlguenego/asn1');
const {inspect} = require('util');

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
```

### Command line

```
asn1-parse --help
```

```
Usage: asn1-parse [options] <msgFile>

Parse an ASN1 message

Arguments:
  msgFile                       file containing a ASN.1 message to parse

Options:
  -V, --version                 output the version number
  -d, --definition <asn1-file>  specify an ASN.1 definition file (.asn1)
  -t, --type <asn1-type>        specify an ASN.1 type. Must be specified with definition file.
  -f, --format <type>           specify the message format ('bin'|'hex'|'base64') (default: "bin")
  -h, --help                    display help for command
```

#### Example

Inspired by the [ASN.1 wikipedia article](https://en.wikipedia.org/wiki/ASN.1#Example_encoded_in_DER).

Create a protocol definition file called `foo-protocol.asn1` with the ASN.1 syntax:

```
FooProtocol DEFINITIONS ::= BEGIN

    FooQuestion ::= SEQUENCE {
        trackingNumber INTEGER,
        question       IA5String
    }

    FooAnswer ::= SEQUENCE {
        questionNumber INTEGER,
        answer         BOOLEAN
    }

END
```

Create a file message called `foo-question.msg` with the following content (DER format):

```
30 13 02 01 05 16 0e 41 6e 79 62 6f 64 79 20 74 68 65 72 65 3f
```

Run the following:

```
asn1-parse -d foo-protocol.asn1 -t FooQuestion -f hex foo-question.msg
```

The output should be:

```
{
  "tagClass": "UNIVERSAL",
  "tagDefinedType": "FooQuestion",
  "isConstructed": true,
  "tagCode": 16,
  "tagLabel": "SEQUENCE",
  "length": 19,
  "lengthType": "DEFINITE",
  "value": [
    {
      "tagClass": "UNIVERSAL",
      "tagName": "trackingNumber",
      "isConstructed": false,
      "tagCode": 2,
      "tagLabel": "INTEGER",
      "length": 1,
      "lengthType": "DEFINITE",
      "value": 5
    },
    {
      "tagClass": "UNIVERSAL",
      "tagName": "question",
      "isConstructed": false,
      "tagCode": 22,
      "tagLabel": "IA5String",
      "length": 14,
      "lengthType": "DEFINITE",
      "value": "Anybody there?"
    }
  ]
}
```

## Author

Jean-Louis GUENEGO <jlguenego@gmail.com>
