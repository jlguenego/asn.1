import {ASN1AlternativeType} from './ASN1AlternativeType';
import {ASN1ComponentType} from './ASN1ComponentType';
import {ASN1Type} from './ASN1Type';

export class ASN1Sequence extends ASN1Type {
  alternatives: ASN1ComponentType[] = [];

  addAlternative(c: ASN1ComponentType) {
    this.alternatives.push(c);
  }
}
