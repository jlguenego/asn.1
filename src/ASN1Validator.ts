// import dbg from 'debug';
import {ASN1ComponentType} from './asn1/ASN1ComponentType';
import {ASN1DefinedType} from './asn1/ASN1DefinedType';
import {ASN1Module} from './asn1/ASN1Module';
import {ASN1NamedType} from './asn1/ASN1NamedType';
import {ASN1Sequence} from './asn1/ASN1Sequence';
import {ASN1TaggedType} from './asn1/ASN1TaggedType';
import {ASN1Message} from './interfaces/ASN1Message';
import {ASN1Assignment} from './asn1/ASN1Assignment';
import {ASN1ChoiceType} from './asn1/ASN1ChoiceType';

// const debug = dbg('asn.1:validator');

export class ASN1Validator {
  constructor(private module: ASN1Module) {}

  validate(input: ASN1Message, type: string) {
    const assignment = this.module.getAssignment(type);
    this.validateAssignment(input, assignment);
    input.tagDefinedType = assignment.name;
  }

  validateAssignment(input: ASN1Message, assignment: ASN1Assignment) {
    if (assignment.type instanceof ASN1TaggedType) {
      this.validateTaggedType(assignment.type, input);
    }
    if (assignment.type instanceof ASN1Sequence) {
      this.validateSequence(assignment.type, input);
    }
  }

  validateTaggedType(taggedType: ASN1TaggedType, input: ASN1Message) {
    if (input.tagClass !== taggedType.tag.tagClass) {
      throw new Error(
        `taggedType tagClass differ: ${input.tagClass} vs ${taggedType.tag.tagClass}`
      );
    }
    if (input.tagCode !== taggedType.tag.tagCode) {
      throw new Error(
        `taggedType tagCode differ: ${input.tagCode} vs ${taggedType.tag.tagCode}`
      );
    }
    if (taggedType.type instanceof ASN1Sequence) {
      const subInput = taggedType.implicit
        ? input
        : (input.value as ASN1Message[])[0];
      this.validateSequence(taggedType.type, subInput);
    }
    if (taggedType.type instanceof ASN1DefinedType) {
      this.validateDefinedType(taggedType.type, input);
    }
  }

  validateSequence(sequence: ASN1Sequence, input: ASN1Message) {
    let c = 0;
    for (let i = 0; i < sequence.components.length; i++) {
      const component = sequence.components[i];
      if (!(component instanceof ASN1NamedType)) {
        throw new Error('limitation: cannot process only NamedType.');
      }
      // manage optional case
      if (component.optional) {
        try {
          this.validateComponent(
            sequence.components[i],
            (input.value as ASN1Message[])[c]
          );
        } catch (e) {
          continue;
        }
      }

      this.validateComponent(
        sequence.components[i],
        (input.value as ASN1Message[])[c]
      );
      c++;
    }
  }

  validateComponent(component: ASN1ComponentType, input: ASN1Message) {
    if (!(component instanceof ASN1NamedType)) {
      throw new Error('can process only ASN1NamedType');
    }

    if (component.type instanceof ASN1ChoiceType) {
      this.validateChoiceType(component.type, input);
    } else if (component.type instanceof ASN1TaggedType) {
      this.validateTaggedType(component.type, input);
    } else if (component.type instanceof ASN1DefinedType) {
      input.tagDefinedType = component.type.name;
      const assignment = this.module.getAssignment(component.type.name);
      this.validateAssignment(input, assignment);
    } else {
      if (input.value !== null) {
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
      }
    }

    input.tagName = component.name;
  }

  validateDefinedType(type: ASN1DefinedType, input: ASN1Message) {
    input.tagDefinedType = type.name;
    const assignment = this.module.getAssignment(type.name);
    this.validateAssignment((input.value as ASN1Message[])[0], assignment);
  }

  validateChoiceType(type: ASN1ChoiceType, input: ASN1Message) {
    // try to validate the first choice, if not ok, then the second, if not ok, then the third...
    for (let i = 0; i < type.alternatives.length; i++) {
      try {
        this.validateComponent(type.alternatives[i], input);
      } catch (e) {
        continue;
      }
      break;
    }
  }
}
