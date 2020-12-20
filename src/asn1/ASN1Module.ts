import {ASN1Assignment} from './ASN1Assignment';
import {ASN1Message} from '../interfaces/ASN1Message';
import {ASN1Validator} from '../ASN1Validator';

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
}
