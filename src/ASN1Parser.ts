import {EncodingRule} from './EncodingRule';
import {ASN1ParserOptions} from './interfaces';

export class ASN1Parser {
  options: ASN1ParserOptions = {
    encodingRule: EncodingRule.DER,
  };
  constructor(opts: Partial<ASN1ParserOptions>) {
    this.options = {...this.options, ...opts};
  }

  parse(): Object {
    return {};
  }
}
