import {ASN1Lexer} from '../analysis/ASN1Lexer';
import {ASN1CstParser} from '../analysis/ASN1CstParser';
import {ASN1Assignment} from './ASN1Assignment';
import {ASN1Visitor} from '../analysis/ASN1Visitor';
import {ASN1Message} from '../interfaces/ASN1Message';
import {ASN1Validator} from '../ASN1Validator';
import {Props} from '../interfaces/Props';
import {ASN1GeneratorOptions} from '../interfaces/ASN1GeneratorOptions';
import {EncodingRule} from '../EncodingRule';
import {DEREncode} from '../codec/der/encoder/DEREncoder';
import {ASN1Generator} from '../ASN1Generator';

export class ASN1Module {
  assignments: ASN1Assignment[] = [];
  constructor(public name: string) {
    this.assignments = [];
  }

  addAssignment(type: ASN1Assignment) {
    this.assignments.push(type);
  }

  getAssignment(name: string) {
    const assignment = this.assignments.find(a => a.name === name);
    if (!assignment) {
      throw new Error(`Assignment (type) not found: ${name}`);
    }
    return assignment;
  }

  validate(message: ASN1Message, type: string): ASN1Message {
    const msg = JSON.parse(JSON.stringify(message)) as ASN1Message;
    const validator = new ASN1Validator(this);
    validator.validate(msg, type);
    return msg;
  }

  generate(
    type: string,
    data: Props,
    opts: Partial<ASN1GeneratorOptions> = {}
  ): Buffer {
    const options = {
      encodingRule: EncodingRule.DER,
      inputFormat: 'json',
      ...opts,
    };
    const generator = new ASN1Generator(this, type);
    const asn1Message = generator.generateFromJson(data);
    if (options.encodingRule === EncodingRule.DER) {
      return Buffer.from(DEREncode(asn1Message), 'hex');
    }
    throw new Error(
      'generate: encoding rule not yet implemented: ' + options.encodingRule
    );
  }
}
