import {ASN1Module} from './asn1/ASN1Module';
import {DERValidator} from './codec/der/DERValidator';
import {EncodingRule} from './EncodingRule';
import {Props} from './interfaces/Props';

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

  validate(input: Props[], types: string[], encodingRule = EncodingRule.DER) {
    const assignments = getAssignments(this.module, types);
    if (encodingRule === EncodingRule.DER) {
      const validator = new DERValidator();
      validator.validateAll(assignments, input);
      return;
    }
    throw new Error(
      `${encodingRule} not yet supported. (Only DER supported at this time)`
    );
  }
}
