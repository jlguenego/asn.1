import {PathLike, readFileSync} from 'fs';

import {ASN1} from '../ASN1';
import {EncodingRule} from '../EncodingRule';
import {ASN1ParserOptions} from '../interfaces';

export class ASN1Node {
  static parseFileMsg(
    filename: PathLike,
    opts: Partial<ASN1ParserOptions> = {}
  ) {
    const options = {
      format: 'bin',
      encodingRule: EncodingRule.DER,
      ...opts,
    } as ASN1ParserOptions;

    const encoding = options.format === 'bin' ? 'binary' : 'utf8';
    const content = readFileSync(filename, {encoding});
    return ASN1.parseMsg(content, options);
  }
}
