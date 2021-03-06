import {ASN1CstParser} from '../ASN1CstParser';
import {L_SQUARE, NumberToken, R_SQUARE} from '../ASN1Lexer';
import {k} from '../lexer/ASN1Keyword';

export function initTaggedTypeRules(this: ASN1CstParser) {
  this.RULE('TaggedType', () => {
    this.SUBRULE(this.Tag);
    this.OPTION(() => {
      this.addOrTokenList([k.IMPLICIT, k.EXPLICIT]);
    });
    this.SUBRULE(this.Type);
  });

  this.RULE('Tag', () => {
    // 31.2.1 "[" EncodingReference Class ClassNumber "]"
    this.CONSUME(L_SQUARE);
    this.SUBRULE(this.Class);
    this.SUBRULE(this.ClassNumber);
    this.CONSUME(R_SQUARE);
  });

  this.RULE('Class', () => {
    this.OPTION(() => {
      this.addOrTokenList([k.UNIVERSAL, k.APPLICATION, k.PRIVATE]);
    });
  });

  this.RULE('ClassNumber', () => {
    this.CONSUME(NumberToken);
  });
}
