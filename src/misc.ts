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
