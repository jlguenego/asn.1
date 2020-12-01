import {ASN1Module} from './asn1/ASN1Module';
import {Props} from './interfaces/Props';

export class ASN1Validator {
  module: ASN1Module;
  constructor(private definition: string, private type?: string) {
    this.module = ASN1Module.compile(this.definition);
    if (!this.type) {
      this.type = this.module.getDefaultType();
    }
  }

  validate(output: Props[]): boolean {
    if (output) {
      return true;
    }
    return false;
  }
}
