import {ASN1ComponentType} from './ASN1ComponentType';
import {ASN1Type} from './ASN1Type';

export class ASN1ChoiceType extends ASN1Type {
  alternatives: ASN1ComponentType[] = [];

  addAlternative(c: ASN1ComponentType) {
    this.alternatives.push(c);
  }
}
