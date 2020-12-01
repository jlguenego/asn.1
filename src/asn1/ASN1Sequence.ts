import {ASN1ComponentType} from './ASN1ComponentType';
import {ASN1Type} from './ASN1Type';

export class ASN1Sequence extends ASN1Type {
  components: ASN1ComponentType[] = [];

  addComponent(c: ASN1ComponentType) {
    this.components.push(c);
  }
}
