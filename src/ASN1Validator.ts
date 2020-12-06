import {ASN1Module} from './asn1/ASN1Module';
import {DERValidator} from './codec/der/DERValidator';
import {EncodingRule} from './EncodingRule';
import {ASN1Message} from './interfaces/ASN1Message';

const getAssignments = (module: ASN1Module, types: string[]) => {
  if (!types.length) {
    return [module.assignments[0]];
  }
  return types.map(type => module.getAssignment(type));
};

export class ASN1Validator {
  module: ASN1Module;
  constructor(private definition: string) {
    this.module = ASN1Module.compile(this.definition);
  }

  validate(
    input: ASN1Message,
    types: string[],
    encodingRule = EncodingRule.DER
  ) {
    const assignment = getAssignments(this.module, types)[0];
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
