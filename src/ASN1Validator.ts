import {ASN1Module} from './asn1/ASN1Module';
import {DERValidator} from './codec/der/DERValidator';
import {EncodingRule} from './EncodingRule';
import {ASN1Message} from './interfaces/ASN1Message';

export class ASN1Validator {
  module: ASN1Module;
  constructor(private definition: string) {
    this.module = ASN1Module.compile(this.definition);
  }

  validate(input: ASN1Message, type: string, encodingRule = EncodingRule.DER) {
    const assignment = this.module.getAssignment(type);
    if (encodingRule === EncodingRule.DER) {
      const validator = new DERValidator();
      validator.validate(assignment, input);
      return;
    }
    throw new Error(
      `${encodingRule} not yet supported. (Only DER supported at this time)`
    );
  }
}
