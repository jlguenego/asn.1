import {ASN1Assignment} from '../../asn1/ASN1Assignment';
import {ASN1ComponentType} from '../../asn1/ASN1ComponentType';
import {ASN1NamedType} from '../../asn1/ASN1NamedType';
import {ASN1Sequence} from '../../asn1/ASN1Sequence';
import {ASN1TaggedType} from '../../asn1/ASN1TaggedType';
import {ASN1Message} from '../../interfaces/ASN1Message';

export class DERValidator {
  validate(assignment: ASN1Assignment, input: ASN1Message) {
    if (assignment.type instanceof ASN1TaggedType) {
      this.validateTaggedType(assignment.type, input);
    }
    if (assignment.type instanceof ASN1Sequence) {
      this.validateSequence(assignment.type, input);
    }
    input.tagName = assignment.name;
    return;
  }

  validateTaggedType(taggedType: ASN1TaggedType, input: ASN1Message) {
    if (input.tagClass !== taggedType.tag.tagClass) {
      throw new Error(
        'taggedType tagClass differ: ${input.tagClass} vs ${taggedType.tag.tagClass} '
      );
    }
    if (input.tagCode !== taggedType.tag.tagCode) {
      throw new Error(
        'taggedType tagCode differ: ${input.tagCode} vs ${taggedType.tag.tagCode} '
      );
    }
    if (taggedType.type instanceof ASN1Sequence) {
      this.validateSequence(taggedType.type, (input.value as ASN1Message[])[0]);
    }
  }

  validateSequence(sequence: ASN1Sequence, input: ASN1Message) {
    console.log('input: ', input);
    console.log('sequence: ', sequence);
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
