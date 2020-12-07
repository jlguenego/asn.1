import {CursorDataView} from '../../../../CursorDataView';

export function readOctetString(cdv: CursorDataView, length: number) {
  // 8.7.2 The primitive encoding contains zero, one or more contents octets
  // equal in value to the octets in the data value, in the order they appear
  // in the data value, and with the most significant bit of an octet of
  // the data value, aligned with the most significant bit of an octet
  // of the contents octets.

  return cdv.readString(length, 'hex');
}
