import {Props} from './interfaces/Props';

export class ASN1Validator {
  // ast: ASN1AST;
  constructor(private definition: string) {
    // this.ast = new ASN1AST(definition);
  }

  validate(output: Props[]): boolean {
    if (output) {
      return true;
    }
    return false;
  }
}
