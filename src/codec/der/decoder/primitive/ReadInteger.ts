import {DERDecoder} from '../../DERDecoder';

export function readInteger(d: DERDecoder, length: number) {
  if (length === 0) {
    return undefined;
  }
  let result = 0;
  for (let i = 0; i < length; i++) {
    const v = d.read();
    result = result * 256 + v;
  }
  return result;
}
