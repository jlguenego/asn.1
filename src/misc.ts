import {readFileSync} from 'fs';
export const sanitize = (str: string) =>
  str
    .replace(/#.*/g, '')
    .replace(/ /g, '')
    .replace(/\r?\n|\r/g, '');

export const readEncodedFile = (filename: string): ArrayBuffer => {
  const inputMsg = readFileSync(filename, {
    encoding: 'utf8',
  });

  const buf = Buffer.from(sanitize(inputMsg), 'hex');
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
};

// 0110011001010 -> 0 1100 1100 1010
export function formatBitString(value: string): string {
  const bits = value.split('');
  let result = '';
  for (let i = 0; i < bits.length; i++) {
    const bit = bits[bits.length - 1 - i];
    const sep = i === 0 || i % 4 ? '' : '_';
    result = bit + sep + result;
  }
  return result;
}
