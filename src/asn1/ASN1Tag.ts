import {TagClass} from '../interfaces/TagClass';

export class ASN1Tag {
  constructor(public tagClass: TagClass, public tagCode: number) {}
}
