import {ASN1Type} from './ASN1Type';

export class ASN1Assignment {
  types: ASN1Type[] = [];
  constructor(public name: string) {}
  setType(type: ASN1Type) {
    this.types.push(type);
  }
}
