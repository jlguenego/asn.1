# Message generation

## Example

```js
const {ASN1} = require('@jlguenego/asn1');
const {inspect} = require('util');

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
asn1Module.generate(data, {encodingRule: 'DER'});
```
