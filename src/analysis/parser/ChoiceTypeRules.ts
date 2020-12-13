import {ASN1CstParser} from '../ASN1CstParser';
import {COMMA, L_CURLY, R_CURLY} from '../ASN1Lexer';
import {k} from '../lexer/ASN1Keyword';

export function initChoiceTypeRules(this: ASN1CstParser) {
  // clause 29
  this.RULE('ChoiceType', () => {
    this.CONSUME(k.CHOICE);
    this.CONSUME(L_CURLY);
    this.SUBRULE(this.AlternativeTypeLists);
    this.CONSUME(R_CURLY);
  });

  this.RULE('AlternativeTypeLists', () => {
    this.SUBRULE(this.RootAlternativeTypeList);
  });

  this.RULE('RootAlternativeTypeList', () => {
    this.SUBRULE(this.AlternativeTypeList);
  });

  this.RULE('AlternativeTypeList', () => {
    this.MANY_SEP({
      SEP: COMMA,
      DEF: () => {
        this.SUBRULE(this.AlternativeType);
      },
    });
  });

  this.RULE('AlternativeType', () => {
    this.SUBRULE(this.NamedType);
  });
}
