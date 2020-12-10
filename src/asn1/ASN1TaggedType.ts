import {ASN1Tag} from './ASN1Tag';
import {ASN1Type} from './ASN1Type';

export class ASN1TaggedType {
  constructor(public tag: ASN1Tag, public type: ASN1Type) {}
}
