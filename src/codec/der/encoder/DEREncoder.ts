import {inspect} from 'util';
import {ASN1Message} from '../../../interfaces/ASN1Message';

export function DEREncode(asn1Message: ASN1Message): Buffer {
  console.log('asn1Message: ', inspect(asn1Message, false, null, true));
  return Buffer.from('0001020304', 'hex');
}
