import {program} from 'commander';
import fs from 'fs';
import path from 'path';
import {inspect} from 'util';

import {version} from '../package.json';
import {ASN1} from './ASN1';
import {Props} from './interfaces/Props';
import {cloneAlpha, sanitize} from './misc';

export function asn1Parse(): void {
  program
    .version(version)
    .arguments('<msgFile>')
    .option(
      '-d, --definition <asn1-file>',
      'specify an ASN.1 definition file (.asn1)'
    )
    .option(
      '-t, --type <asn1-type>',
      'specify an ASN.1 type. Must be specified with definition file.'
    )
    .option(
      '-f, --format <type>',
      "specify the message format ('binary'|'hex'|'base64')",
      'hex'
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
    if (program['format'] === 'binary') {
      const b = fs.readFileSync(file);
      input = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
    } else if (program['format'] === 'hex') {
      const str = fs.readFileSync(file, {encoding: 'utf8'});
      const b = Buffer.from(sanitize(str), 'hex');
      input = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
    } else if (program['format'] === 'base64') {
      const str = fs.readFileSync(file, {encoding: 'utf8'});
      const b = Buffer.from(sanitize(str), 'base64');
      input = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
    } else {
      throw new Error(
        `Cannot understand the format. (${program['format']}. Value accepted: bin|hex|base64)`
      );
    }
  } catch (e) {
    if (e instanceof Error) {
      console.log('Cannot read <msgFile>:', e.message);
    }
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
    if (e instanceof Error) {
      console.log('Cannot read <asn1-file>:', e.message);
    }
    program.help();
  }

  let output = ASN1.decode(input);
  if (asn1Definition) {
    if (!program.type) {
      console.log('When --definition is specified, --type must be too.');
      program.help();
    }

    const module = ASN1.getModuleFromStr(asn1Definition);
    output = ASN1.validate(module, output, program.type);
  }
  console.log(
    inspect(cloneAlpha(output as unknown as Props), false, null, true)
  );
}
