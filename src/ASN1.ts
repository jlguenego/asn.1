import {ASN1Module} from './asn1/ASN1Module';
import {ASN1ModuleFactory} from './asn1/ASN1ModuleFactory';
import {BERDecode} from './codec/ber/decoder/BERDecoder';
import {EncodingRule} from './EncodingRule';
import {ASN1ParserOptions} from './interfaces';
import {getArrayBufferFromStr} from './misc';

export class ASN1 {
  static parseMsg(
    message: string | ArrayBuffer,
    opts: Partial<ASN1ParserOptions> = {}
  ) {
    const options = {
      format: 'bin',
      encodingRule: EncodingRule.DER,
      ...opts,
    } as ASN1ParserOptions;

    let input: ArrayBuffer;
    if (typeof message === 'string') {
      input = getArrayBufferFromStr(message, options.format);
    } else {
      input = message;
    }

    if (
      [EncodingRule.BER, EncodingRule.CER, EncodingRule.DER].includes(
        options.encodingRule
      )
    ) {
      return BERDecode(input);
    }
    throw new Error(
      'Encoding rule not yet implemented: ' + options.encodingRule
    );
  }

  static getModuleFromStr(definition: string): ASN1Module {
    return ASN1ModuleFactory.compile(definition);
  }
}
