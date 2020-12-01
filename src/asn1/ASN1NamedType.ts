import {ASN1Type} from './ASN1Type';

export class ASN1NamedType {
  constructor(public name: string, public type: ASN1Type) {}
}
