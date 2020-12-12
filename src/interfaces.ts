import {EncodingRule} from './EncodingRule';
import {ASN1MessageFormat} from './interfaces/ASN1MessageFormat';

export interface ASN1ParserOptions {
  encodingRule: EncodingRule;
  format: ASN1MessageFormat;
}
