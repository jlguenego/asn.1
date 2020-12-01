import {program} from 'commander';
import fs from 'fs';
import path from 'path';
import {version} from '../package.json';
import {ASN1Parser} from './ASN1Parser';
import {ASN1Validator} from './ASN1Validator';

export function asn1Parse(): void {
  program
    .version(version)
    .arguments('<msgFile>')
    .option(
      '-d, --definition <asn1-file>',
      'specify a ASN.1 definition file (.asn1)'
    )
    .option(
      '-t, --type <asn1-type>',
      'specify a ASN.1 type. Default is the first type described in the ASN.1 definition file.'
    )
    .option(
      '-f, --format <type>',
      "specify the message format ('bin'|'hex'|'base64')",
      'bin'
    )
    .description('Parse an ASN1 message', {
      msgFile: 'file containing a ASN.1 message to parse',
    });

  program.parse(process.argv);

  if (program.args.length === 0) {
    console.log('<msgFile> must be a file specified.');
    program.help();
  }

  const file = path.resolve(process.cwd(), program.args[0]);

  let input: ArrayBuffer;
  try {
    if (program['format'] === 'bin') {
      const b = fs.readFileSync(file);
      input = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
    } else if (program['format'] === 'hex') {
      const str = fs.readFileSync(file, {encoding: 'utf8'});
      const b = Buffer.from(str.replace(/\s/gm, ''), 'hex');
      input = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
    } else if (program['format'] === 'base64') {
      const str = fs.readFileSync(file, {encoding: 'utf8'});
      const b = Buffer.from(str.replace(/\s/gm, ''), 'base64');
      input = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
    } else {
      throw new Error(
        `Cannot understand the format. (${program['format']}. Value accepted: bin|hex|base64)`
      );
    }
  } catch (e) {
    console.log('Cannot read <msgFile>:', e.message);
    program.help();
  }

  let asn1Definition: string | undefined;
  try {
    if (program['definition']) {
      const asn1File = path.resolve(process.cwd(), program['definition']);
      asn1Definition = fs.readFileSync(asn1File, {encoding: 'utf8'});
    } else {
      asn1Definition = undefined;
    }
  } catch (e) {
    console.log('Cannot read <asn1-file>:', e.message);
    program.help();
  }

  const asn1Parser = new ASN1Parser({});
  const output = asn1Parser.parse(input);
  console.log('output: ', output);

  if (asn1Definition) {
    const asn1Validator = new ASN1Validator(asn1Definition);
    const validated = asn1Validator.validate(output);
    console.log('validated: ', validated);
  }
}
