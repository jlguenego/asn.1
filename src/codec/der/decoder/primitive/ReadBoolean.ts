import {DERDecoder} from '../../DERDecoder';

export function readBoolean(d: DERDecoder, length: number) {
  if (length === 0) {
    return undefined;
  }
  if (length !== 1) {
    throw new Error('length must be 1');
  }
  const v = d.read();
  if (v === 0xff) {
    return true;
  }
  if (v === 0x00) {
    return false;
  }
  throw new Error('in DER boolean must be encoded as 0x00 or 0xFF');
}
