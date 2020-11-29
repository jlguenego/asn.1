# ASN.1

## Install

```
npm i -g @jlguenego/asn.1
```

## Usage

### Command line

```
asn1-parse [ -s <asn1-specfile> ] [ -e <asn1-encoding-rule> ] [ -f <input-file-encoding> ] [ -t type ]    <messagefile>
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

Create a file message called `foo-question.msg` with the following content:

```
30 13 02 01 05 16 0e 41 6e 79 62 6f 64 79 20 74 68 65 72 65 3f
```

Run the following:

```
asn1-parse -s foo-protocol.asn1 -e DER -t FooQuestion -f hex foo-question.msg
```

The output should be:

```
{
  "trackingNumber" : "5",
  "question" : "Anybody there?"
}
```

## Author

Jean-Louis GUENEGO <jlguenego@gmail.com>
