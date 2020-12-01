import {ASN1Assignment} from '../../asn1/ASN1Assignment';
import {Props} from '../../interfaces/Props';

export class DERValidator {
  validateAll(assignments: ASN1Assignment[], input: Props[]) {
    for (let i = 0; i < assignments.length; i++) {
      this.validate(assignments[i], input[i]);
    }
  }

  validate(assignment: ASN1Assignment, input: Props) {
    // the real job.
    return;
  }
}
