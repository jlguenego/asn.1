import {ASN1Parser} from './ASN1Parser';

import {ASN1ParserOptions} from './interfaces';

export function asn1Parse(opts: Partial<ASN1ParserOptions> = {}): Object {
  return new ASN1Parser(opts).parse();
}
