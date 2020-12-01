import {ASN1Assignment} from '../../asn1/ASN1Assignment';
import {ASN1ComponentType} from '../../asn1/ASN1ComponentType';
import {ASN1NamedType} from '../../asn1/ASN1NamedType';
import {ASN1Sequence} from '../../asn1/ASN1Sequence';
import {Props, PropsItem} from '../../interfaces/Props';

export class DERValidator {
  validateAll(assignments: ASN1Assignment[], input: Props[]) {
    for (let i = 0; i < assignments.length; i++) {
      this.validate(assignments[i], input[i]);
    }
  }

  validate(assignment: ASN1Assignment, input: Props) {
    if (assignment.type instanceof ASN1Sequence) {
      this.validateSequence(assignment.type, input);
    }
    return;
  }

  validateSequence(sequence: ASN1Sequence, input: Props) {
    for (let i = 0; i < sequence.components.length; i++) {
      this.validateComponent(sequence.components[i], input[i]);
    }
  }
  validateComponent(component: ASN1ComponentType, input: PropsItem) {
    if (!(component instanceof ASN1NamedType)) {
      throw new Error('can process only ASN1NamedType');
    }
    const name = component.type.constructor.name;
    switch (name) {
      case 'ASN1BooleanType':
        if (typeof input !== 'boolean') {
          throw new Error('must be an boolean');
        }
        break;
      case 'ASN1IntegerType':
        if (!Number.isInteger(input)) {
          throw new Error('must be an integer');
        }
        break;
      case 'ASN1IA5StringType':
        if (typeof input !== 'string') {
          throw new Error(`must be an string: ${input}`);
        }
        break;
      default:
        break;
    }
  }
}
