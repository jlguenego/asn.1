import {readFileSync} from 'fs';
import {Props} from './interfaces/Props';
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

// 0110011001010 -> 0_1100_1100_1010
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

export function cloneAlpha(obj: Props): Props {
  const x: Props = {};
  for (const key of Object.keys(obj).sort()) {
    if (obj[key] instanceof Array) {
      x[key] = (obj[key] as Props[]).map(k => cloneAlpha(k));
    } else if (obj[key] instanceof Object) {
      x[key] = cloneAlpha(obj[key] as Props);
    } else {
      x[key] = obj[key];
    }
  }
  return x;
}
