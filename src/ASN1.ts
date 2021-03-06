import {ASN1Module} from './asn1/ASN1Module';
import {ASN1ModuleFactory} from './asn1/ASN1ModuleFactory';
import {ASN1Generator} from './ASN1Generator';
import {ASN1Validator} from './ASN1Validator';
import {BERDecode} from './codec/ber/decoder/BERDecoder';
import {DEREncode} from './codec/der/encoder/DEREncoder';
import {EncodingRule} from './EncodingRule';
import {ASN1ParserOptions} from './interfaces';
import {ASN1GeneratorOptions} from './interfaces/ASN1GeneratorOptions';
import {ASN1Message} from './interfaces/ASN1Message';
import {ASN1MessageFormat} from './interfaces/ASN1MessageFormat';
import {Props} from './interfaces/Props';
import {getArrayBufferFromStr} from './misc';

export class ASN1 {
  static decode(
    message: string | ArrayBuffer,
    opts: Partial<ASN1ParserOptions> = {}
  ) {
    const options: ASN1ParserOptions = {
      format: ASN1MessageFormat.HEX,
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

  static encode(
    asn1Message: ASN1Message,
    encodingRule = EncodingRule.DER
  ): Buffer {
    if (
      encodingRule === EncodingRule.DER ||
      encodingRule === EncodingRule.BER
    ) {
      return Buffer.from(DEREncode(asn1Message), 'hex');
    }
    throw new Error(
      'generate: encoding rule not yet implemented: ' + encodingRule
    );
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
    return ASN1.encode(asn1Message, options.encodingRule);
  }

  static validate(
    module: ASN1Module,
    message: ASN1Message,
    type: string
  ): ASN1Message {
    const msg = JSON.parse(JSON.stringify(message)) as ASN1Message;
    const validator = new ASN1Validator(module);
    validator.validate(msg, type);
    return msg;
  }
}
