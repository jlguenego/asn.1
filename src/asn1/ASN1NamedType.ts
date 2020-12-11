import {ASN1ComponentType} from './ASN1ComponentType';
import {ASN1Type} from './ASN1Type';

export class ASN1NamedType extends ASN1ComponentType {
  optional = false;
  constructor(public name: string, public type: ASN1Type) {
    super();
  }
}
