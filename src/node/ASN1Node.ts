import {PathLike, readFileSync} from 'fs';

import {ASN1} from '../ASN1';
import {EncodingRule} from '../EncodingRule';
import {ASN1ParserOptions} from '../interfaces';
import {ASN1MessageFormat} from '../interfaces/ASN1MessageFormat';

export class ASN1Node {
  static parseFileMsg(
    filename: PathLike,
    opts: Partial<ASN1ParserOptions> = {}
  ) {
    const options = {
      format: ASN1MessageFormat.HEX,
      encodingRule: EncodingRule.DER,
      ...opts,
    } as ASN1ParserOptions;

    const encoding =
      options.format === ASN1MessageFormat.BINARY ? 'binary' : 'utf8';
    const content = readFileSync(filename, {encoding});
    return ASN1.decode(content, options);
  }
}
