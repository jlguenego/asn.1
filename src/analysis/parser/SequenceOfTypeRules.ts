import {ASN1CstParser} from '../ASN1CstParser';
import {OF, SEQUENCE} from '../ASN1Lexer';

export function initSequenceOfTypeRules(this: ASN1CstParser) {
  this.RULE('SequenceOfType', () => {
    this.CONSUME(SEQUENCE);
    this.CONSUME(OF);
    this.SUBRULE(this.Type);
  });
}
