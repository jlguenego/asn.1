import {ASN1Assignment} from '../../asn1/ASN1Assignment';
import {ASN1ComponentType} from '../../asn1/ASN1ComponentType';
import {ASN1NamedType} from '../../asn1/ASN1NamedType';
import {ASN1Sequence} from '../../asn1/ASN1Sequence';
import {ASN1Message} from '../../interfaces/ASN1Message';

export class DERValidator {
  validate(assignment: ASN1Assignment, input: ASN1Message) {
    if (assignment.type instanceof ASN1Sequence) {
      this.validateSequence(assignment.type, input);
    }
    input.tagName = assignment.name;
    return;
  }

  validateSequence(sequence: ASN1Sequence, input: ASN1Message) {
    for (let i = 0; i < sequence.components.length; i++) {
      this.validateComponent(
        sequence.components[i],
        (input.value as ASN1Message[])[i]
      );
    }
  }
  validateComponent(component: ASN1ComponentType, input: ASN1Message) {
    if (!(component instanceof ASN1NamedType)) {
      throw new Error('can process only ASN1NamedType');
    }
    const name = component.type.constructor.name;
    switch (name) {
      case 'ASN1BooleanType':
        if (typeof input.value !== 'boolean') {
          throw new Error('must be an boolean');
        }
        break;
      case 'ASN1IntegerType':
        if (!Number.isInteger(input.value)) {
          throw new Error('must be an integer');
        }
        break;
      case 'ASN1IA5StringType':
        if (typeof input.value !== 'string') {
          throw new Error(`must be an string: ${input}`);
        }
        break;
      default:
        break;
    }
    input.tagName = component.name;
  }
}
