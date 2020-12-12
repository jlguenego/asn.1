import {EncodingRule} from '../EncodingRule';

export interface ASN1GeneratorOptions {
  encodingRule: EncodingRule;
  inputFormat: 'json' | 'array';
}
