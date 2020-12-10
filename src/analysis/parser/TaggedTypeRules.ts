import {ASN1CstParser} from '../ASN1CstParser';
import {L_SQUARE, NumberToken, R_SQUARE} from '../ASN1Lexer';

export function initTaggedTypeRules(this: ASN1CstParser) {
  this.RULE('TaggedType', () => {
    this.SUBRULE(this.Tag);
    this.SUBRULE(this.Type);
  });

  this.RULE('Tag', () => {
    // 31.2.1 "[" EncodingReference Class ClassNumber "]"
    this.CONSUME(L_SQUARE);
    this.SUBRULE(this.ClassNumber);
    this.CONSUME(R_SQUARE);
  });

  this.RULE('ClassNumber', () => {
    this.CONSUME(NumberToken);
  });
}
