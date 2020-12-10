import {ASN1CstParser} from '../ASN1CstParser';
import {SIZE} from '../ASN1Lexer';

export function initSizeConstraintRules(this: ASN1CstParser) {
  this.RULE('SizeConstraint', () => {
    this.CONSUME(SIZE);
    this.SUBRULE(this.Constraint);
  });
}
