import {DERDecoder} from '../../DERDecoder';

export function readBitString(d: DERDecoder, length: number) {
  const input = d.derInput;
  const buffer = input.dataview.buffer.slice(input.index, input.index + length);
  const value = Buffer.from(buffer).toString('hex');
  input.index += length;
  return value;
}
