import {ASN1Module} from './asn1/ASN1Module';
import {ASN1Message} from './interfaces/ASN1Message';
import {LengthType} from './interfaces/LengthType';
import {Props} from './interfaces/Props';
import {TagClass} from './interfaces/TagClass';

export class ASN1Generator {
  constructor(public module: ASN1Module, public type: string) {}
  generateFromJson(data: Props): ASN1Message {
    console.log('data: ', data);
    return {
      isConstructed: false,
      lengthType: LengthType.DEFINITE,
      length: 0,
      tagCode: 0,
      tagClass: TagClass.UNIVERSAL,
      value: null,
      tagLabel: 'undefined',
    };
  }
}
