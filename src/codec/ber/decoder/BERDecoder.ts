import dbg from 'debug';
import {CursorDataView} from '../../../CursorDataView';
import {ASN1Message} from '../../../interfaces/ASN1Message';
import {BERLength} from '../../../interfaces/BERLength';
import {LengthType} from '../../../interfaces/LengthType';
import {TagUniversal} from '../../../interfaces/TagUniversal';
import {TagDecoder} from '../../../TagDecoder';
import {Identifier} from './Identifier';
import {getTagClass, isConstructed} from './misc';
import {readBitString} from './primitive/ReadBitString';
import {readBoolean} from './primitive/ReadBoolean';
import {readIA5String} from './primitive/ReadIA5String';
import {readInteger} from './primitive/ReadInteger';
import {readObjectIdentifier} from './primitive/ReadObjectIdentifier';
import {readOctetString} from './primitive/ReadOctetString';

const debug = dbg('asn.1:BERDecoder');

export function BERDecode(input: ArrayBuffer): ASN1Message {
  const cdv = new CursorDataView(input);
  const identifier = readIdentifierOctets(cdv);
  if (identifier.isComposed()) {
    return readComposed(cdv, identifier);
  }
  return readSimple(cdv, identifier);
}

function readIdentifierOctets(cdv: CursorDataView): Identifier {
  const result = new Identifier();
  const octet = cdv.read();
  // (8.1.2.2 a)
  result.tagClass = getTagClass(octet);
  // (8.1.2.2 b)
  result.constructed = isConstructed(octet);
  // (8.1.2.4.1 c)
  result.tag = octet & 0b0001_1111;
  if (result.tag < 0b0001_1111) {
    return result;
  }
  // multi octets.
  let tagNumberStr = '';
  let octetN;
  while (true) {
    octetN = cdv.read();
    // bit 7 to 1 (8.1.2.4.2 b)
    const str = (octetN & 0b0111_1111).toString(2);
    console.log('str: ', str);
    tagNumberStr += str;
    // last octet (8.1.2.4.2 a)
    if ((octetN & 0b1000_0000) === 0) {
      break;
    }
  }
  // (8.1.2.4.2 b) concactenation
  result.tag = parseInt(tagNumberStr, 2);
  return result;
}

function readLengthOctets(cdv: CursorDataView): BERLength {
  const berLength: BERLength = {type: LengthType.DEFINITE, length: 0};
  const length = cdv.read();
  // (8.1.3.6.1): indefinite form
  if (length === 0b1000_0000) {
    return {type: LengthType.INDEFINITE, length: -1};
  }
  // (8.1.3.4): one octet case (<=127, definite form)
  if ((length & 0b1000_0000) === 0) {
    berLength.length = length;
    return berLength;
  }

  // (8.1.3.5 b) Big Length case (>127)
  let bigLength = 0;
  for (let i = 0; i < length - 0b1000_0000; i++) {
    const nbr = cdv.read();
    bigLength = bigLength * 256 + nbr;
  }
  berLength.length = bigLength;
  return berLength;
}

function readComposed(
  cdv: CursorDataView,
  identifier: Identifier
): ASN1Message {
  const {length, type} = readLengthOctets(cdv);
  debug('type: ', type);
  const result: ASN1Message = {
    tagClass: identifier.tagClass,
    isConstructed: identifier.constructed,
    tagCode: identifier.tag,
    tagLabel: TagDecoder.getLabel(identifier.tagClass, identifier.tag),
    length: length,
    lengthType: type,
    value: null,
  };
  if (length === 0) {
    return result;
  }
  const max = cdv.index + length;
  result.value = [];
  while (cdv.index < max) {
    const ident = readIdentifierOctets(cdv);
    if (ident.isComposed()) {
      const a = readComposed(cdv, ident);
      result.value.push(a);
      continue;
    }
    result.value.push(readSimple(cdv, ident));
  }
  return result;
}

function readSimple(cdv: CursorDataView, identifier: Identifier): ASN1Message {
  const {length, type} = readLengthOctets(cdv);
  debug('type: ', type);

  const result: ASN1Message = {
    tagClass: identifier.tagClass,
    isConstructed: identifier.constructed,
    tagCode: identifier.tag,
    tagLabel: TagDecoder.getLabel(identifier.tagClass, identifier.tag),
    length: length,
    lengthType: type,
    value: null,
  };

  if (identifier.tag === TagUniversal.BOOLEAN.code) {
    result.value = readBoolean(cdv, length);
    return result;
  }
  if (identifier.tag === TagUniversal.INTEGER.code) {
    result.value = readInteger(cdv, length);
    return result;
  }
  if (identifier.tag === TagUniversal.BIT_STRING.code) {
    result.value = readBitString(cdv, length);
    return result;
  }
  if (identifier.tag === TagUniversal.OCTET_STRING.code) {
    result.value = readOctetString(cdv, length);
    return result;
  }
  if (identifier.tag === TagUniversal.OBJECT_IDENTIFIER.code) {
    if (identifier.constructed) {
      throw new Error(
        'The encoding of an Object Identifier should be primitive (clause 8.19.1).'
      );
    }
    result.value = readObjectIdentifier(cdv, length);
    return result;
  }
  if (identifier.tag === TagUniversal.IA5STRING.code) {
    result.value = readIA5String(cdv, length);
    return result;
  }
  if (identifier.tag === TagUniversal.GENERAL_STRING.code) {
    result.value = readIA5String(cdv, length);
    return result;
  }
  throw new Error(
    `cannot understand the identifier tag number: ${identifier.tag}`
  );
}
