import {ASN1Assignment} from './asn1/ASN1Assignment';
import {ASN1ComponentType} from './asn1/ASN1ComponentType';
import {ASN1DefinedType} from './asn1/ASN1DefinedType';
import {ASN1Module} from './asn1/ASN1Module';
import {ASN1NamedType} from './asn1/ASN1NamedType';
import {ASN1Sequence} from './asn1/ASN1Sequence';
import {ASN1Message, ASN1Type} from './interfaces/ASN1Message';
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
    generateFromJson(this.asn1Message, data);
    return this.asn1Message;
  }

  generateFromAssignement(assignment: ASN1Assignment): ASN1Message {
    if (assignment.type instanceof ASN1Sequence) {
      return this.generateFromSequence(assignment.type);
    }
    throw new Error('not yet implemented');
  }

  generateFromSequence(sequence: ASN1Sequence): ASN1Message {
    const message = {
      isConstructed: true,
      tagClass: TagClass.UNIVERSAL,
      tagCode: TagUniversal.SEQUENCE.code,
      tagLabel: TagUniversal.SEQUENCE.label,
      value: [] as ASN1Message[],
    };

    for (let i = 0; i < sequence.components.length; i++) {
      const msg = this.generateFromComponent(sequence.components[i]);
      message.value.push(msg);
    }
    return message;
  }

  generateFromComponent(component: ASN1ComponentType): ASN1Message {
    if (!(component instanceof ASN1NamedType)) {
      throw new Error('only implement ASN1NamedType at this time');
    }
    let message: ASN1Message;
    if (component.type instanceof ASN1Sequence) {
      message = this.generateFromSequence(component.type);
    } else if (component.type instanceof ASN1DefinedType) {
      message = this.generateFromDefinedType(component.type);
    } else {
      message = {
        isConstructed: false,
        tagClass: TagClass.UNIVERSAL,
        tagCode: -1,
        tagLabel: 'TBD',
        value: null,
      };
      switch (component.type.constructor.name) {
        case 'ASN1BooleanType':
          message.tagLabel = TagUniversal.BOOLEAN.label;
          message.tagCode = TagUniversal.BOOLEAN.code;
          message.value = false;
          break;
        case 'ASN1GeneralStringType':
          message.tagLabel = TagUniversal.GENERAL_STRING.label;
          message.tagCode = TagUniversal.GENERAL_STRING.code;
          message.value = 'to be replaced';
          break;
        case 'ASN1IA5StringType':
          message.tagLabel = TagUniversal.IA5STRING.label;
          message.tagCode = TagUniversal.IA5STRING.code;
          message.value = 'to be replaced';
          break;
        case 'ASN1IntegerType':
          message.tagLabel = TagUniversal.INTEGER.label;
          message.tagCode = TagUniversal.INTEGER.code;
          message.value = 1337;
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

function generateFromJson(msg: ASN1Message, data: Props) {
  const array = msg.value as ASN1Message[];
  for (const key of Object.keys(data)) {
    const cell = array.find(c => c.tagName === key);
    if (cell === undefined) {
      throw new Error('cell not found for key = ' + key);
    }
    if (cell.tagCode === TagUniversal.SEQUENCE.code) {
      generateFromJson(cell, data[key] as Props);
    } else {
      cell.value = data[key] as ASN1Type;
    }
  }
}
