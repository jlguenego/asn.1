import {DERDecoder} from '../../DERDecoder';

export function readIA5String(d: DERDecoder, length: number) {
  return d.readString(length);
}
