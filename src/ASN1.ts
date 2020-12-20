import {ASN1Module} from './asn1/ASN1Module';
import {ASN1ModuleFactory} from './asn1/ASN1ModuleFactory';
import {ASN1Generator} from './ASN1Generator';
import {BERDecode} from './codec/ber/decoder/BERDecoder';
import {DEREncode} from './codec/der/encoder/DEREncoder';
import {EncodingRule} from './EncodingRule';
import {ASN1ParserOptions} from './interfaces';
import {ASN1GeneratorOptions} from './interfaces/ASN1GeneratorOptions';
import {Props} from './interfaces/Props';
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

  static generate(
    module: ASN1Module,
    type: string,
    data: Props,
    opts: Partial<ASN1GeneratorOptions> = {}
  ): Buffer {
    const options = {
      encodingRule: EncodingRule.DER,
      inputFormat: 'json',
      ...opts,
    };
    const generator = new ASN1Generator(module, type);
    const asn1Message = generator.generateFromJson(data);
    if (options.encodingRule === EncodingRule.DER) {
      return Buffer.from(DEREncode(asn1Message), 'hex');
    }
    throw new Error(
      'generate: encoding rule not yet implemented: ' + options.encodingRule
    );
  }
}
