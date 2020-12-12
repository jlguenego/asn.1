import {ASN1Message} from '../../../interfaces/ASN1Message';
import {TagClass} from '../../../interfaces/TagClass';
import {TagUniversal} from '../../../interfaces/TagUniversal';
import {padHexString} from '../../../misc';

export function DEREncode(asn1Message: ASN1Message): string {
  const identifierOctetsHexStr = getIdentifierOctet(asn1Message);
  const contentOctetHexStr = getContentOctet(asn1Message);
  const lengthOctetHexStr = getLengthOctet(contentOctetHexStr.length / 2);
  const result =
    identifierOctetsHexStr + lengthOctetHexStr + contentOctetHexStr;
  return result;
}

export function getIdentifierOctet(m: ASN1Message) {
  const tagClassBits = getTagClassBits(m.tagClass);
  const isConstructedBit = getConstructedBit(m.isConstructed);
  const tagCode = m.tagCode;
  const result = padHexString(
    (tagClassBits + isConstructedBit + tagCode).toString(16)
  );
  return result;
}

export function getTagClassBits(tagClass: TagClass) {
  switch (tagClass) {
    case TagClass.UNIVERSAL:
      return 0b0000_0000;
    case TagClass.APPLICATION:
      return 0b0100_0000;
    case TagClass.CONTEXT_SPECIFIC:
      return 0b1000_0000;
    case TagClass.PRIVATE:
      return 0b1100_0000;
  }
}

export function getConstructedBit(isConstructed: boolean) {
  return isConstructed ? 0b0010_0000 : 0;
}

export function getLengthOctet(contentLength: number) {
  if (contentLength < 127) {
    return padHexString(contentLength.toString(16));
  }
  const end = padHexString(contentLength.toString(16));
  return padHexString((end.length / 2).toString(16)) + end;
}

export function getContentOctet(m: ASN1Message): string {
  if (m.tagCode === TagUniversal.BOOLEAN.code) {
    if (m.value === true) {
      return 'ff';
    } else if (m.value === false) {
      return '00';
    }
  }
  if (m.tagCode === TagUniversal.INTEGER.code) {
    return padHexString((m.value as number).toString(16));
  }
  if (
    m.tagCode === TagUniversal.GENERAL_STRING.code ||
    m.tagCode === TagUniversal.IA5STRING.code
  ) {
    return Buffer.from(m.value as string, 'utf8').toString('hex');
  }
  if (m.tagCode === TagUniversal.SEQUENCE.code) {
    const array = m.value as ASN1Message[];
    return array.map(msg => DEREncode(msg)).join('');
  }
  return '';
}
