import {ASN1Module} from './asn1/ASN1Module';
import {EncodingRule} from './EncodingRule';
import {Props} from './interfaces/Props';

export class ASN1Validator {
  module: ASN1Module;
  constructor(private definition: string, private type?: string) {
    this.module = ASN1Module.compile(this.definition);
    if (!this.type) {
      this.type = this.module.getDefaultType();
    }
  }

  validate(input: Props[], encodingRule = EncodingRule.DER): boolean {
    if (encodingRule !== EncodingRule.DER) {
      throw new Error(
        `${encodingRule} not yet supported. (Only DER supported at this time)`
      );
    }
    if (input) {
      return true;
    }
    return false;
  }
}
