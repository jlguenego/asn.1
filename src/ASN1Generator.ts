import {ASN1Assignment} from './asn1/ASN1Assignment';
import {ASN1ComponentType} from './asn1/ASN1ComponentType';
import {ASN1DefinedType} from './asn1/ASN1DefinedType';
import {ASN1Module} from './asn1/ASN1Module';
import {ASN1NamedType} from './asn1/ASN1NamedType';
import {ASN1Sequence} from './asn1/ASN1Sequence';
import {ASN1Message} from './interfaces/ASN1Message';
import {LengthType} from './interfaces/LengthType';
import {Props} from './interfaces/Props';
import {TagClass} from './interfaces/TagClass';
import {TagUniversal} from './interfaces/TagUniversal';

export class ASN1Generator {
  asn1Message: ASN1Message;
  constructor(public module: ASN1Module, public type: string) {
    const assignment = module.getAssignment(type);
    this.asn1Message = this.generateFromAssignement(assignment);
  }

  generateFromJson(data: Props): ASN1Message {
    console.log('data: ', data);
    return this.asn1Message;
  }

  generateFromAssignement(assignment: ASN1Assignment): ASN1Message {
    console.log('assignment: ', assignment);
    if (assignment.type instanceof ASN1Sequence) {
      return this.generateFromSequence(assignment.type);
    }
    throw new Error('not yet implemented');
  }

  generateFromSequence(sequence: ASN1Sequence): ASN1Message {
    console.log('sequence: ', sequence);
    const message = {
      isConstructed: true,
      lengthType: LengthType.DEFINITE,
      length: 0,
      tagCode: TagUniversal.SEQUENCE.code,
      tagClass: TagClass.UNIVERSAL,
      value: [] as ASN1Message[],
      tagLabel: TagUniversal.SEQUENCE.label,
    };

    for (let i = 0; i < sequence.components.length; i++) {
      const msg = this.generateFromComponent(sequence.components[i]);
      message.value.push(msg);
    }
    return message;
  }

  generateFromComponent(component: ASN1ComponentType): ASN1Message {
    console.log('component: ', component);
    if (!(component instanceof ASN1NamedType)) {
      throw new Error('only implement ASN1NamedType at this time');
    }
    let message;
    if (component.type instanceof ASN1Sequence) {
      message = this.generateFromSequence(component.type);
    } else if (component.type instanceof ASN1DefinedType) {
      message = this.generateFromDefinedType(component.type);
    } else {
      message = {
        isConstructed: false,
        lengthType: LengthType.DEFINITE,
        length: 0,
        tagCode: -1,
        tagClass: TagClass.UNIVERSAL,
        value: null,
        tagLabel: 'TBD',
      };
      switch (component.type.constructor.name) {
        case 'ASN1BooleanType':
          message.tagLabel = TagUniversal.BOOLEAN.label;
          message.tagCode = TagUniversal.BOOLEAN.code;
          break;
        case 'ASN1GeneralStringType':
          message.tagLabel = TagUniversal.GENERAL_STRING.label;
          message.tagCode = TagUniversal.GENERAL_STRING.code;
          break;
        case 'ASN1IA5StringType':
          message.tagLabel = TagUniversal.IA5STRING.label;
          message.tagCode = TagUniversal.IA5STRING.code;
          break;
        case 'ASN1IntegerType':
          message.tagLabel = TagUniversal.INTEGER.label;
          message.tagCode = TagUniversal.INTEGER.code;
          break;
        default:
          throw new Error(
            'not yet implemented: type = ' + component.type.constructor.name
          );
      }
    }
    message.tagName = component.name;
    return message;
  }

  generateFromDefinedType(type: ASN1DefinedType): ASN1Message {
    const assignment = this.module.getAssignment(type.name);
    const message = this.generateFromAssignement(assignment);
    message.tagDefinedType = type.name;
    return message;
  }
}
