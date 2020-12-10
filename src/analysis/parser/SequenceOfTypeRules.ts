import {ASN1CstParser} from '../ASN1CstParser';
import {k} from '../lexer/ASN1Keyword';

export function initSequenceOfTypeRules(this: ASN1CstParser) {
  this.RULE('SequenceOfType', () => {
    this.CONSUME(k.SEQUENCE);
    this.CONSUME(k.OF);
    this.SUBRULE(this.Type);
  });
}
