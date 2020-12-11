import dbg from 'debug';

import {BERDecode} from './codec/ber/decoder/BERDecoder';
import {EncodingRule} from './EncodingRule';
import {ASN1ParserOptions} from './interfaces';
import {ASN1Message} from './interfaces/ASN1Message';

const debug = dbg('asn.1:parser');

export class ASN1Parser {
  options: ASN1ParserOptions = {
    encodingRule: EncodingRule.DER,
  };

  constructor(opts: Partial<ASN1ParserOptions> = {}) {
    this.options = {...this.options, ...opts};
  }

  parse(input: ArrayBuffer): ASN1Message {
    debug('parse start');
    if (
      [EncodingRule.BER, EncodingRule.CER, EncodingRule.DER].includes(
        this.options.encodingRule
      )
    ) {
      return BERDecode(input);
    }
    throw new Error(
      'Encoding rule not yet implemented: ' + this.options.encodingRule
    );
  }
}
