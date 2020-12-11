import {ASN1Type} from './ASN1Type';

export class ASN1DefinedType extends ASN1Type {
  constructor(public name: string) {
    super();
  }
}
