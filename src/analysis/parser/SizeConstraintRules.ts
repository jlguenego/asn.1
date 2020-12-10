import {ASN1CstParser} from '../ASN1CstParser';
import {k} from '../lexer/ASN1Keyword';

export function initSizeConstraintRules(this: ASN1CstParser) {
  this.RULE('SizeConstraint', () => {
    this.CONSUME(k.SIZE);
    this.SUBRULE(this.Constraint);
  });
}
