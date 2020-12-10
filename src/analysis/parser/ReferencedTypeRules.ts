import {ASN1CstParser} from '../ASN1CstParser';
import {TypeReference} from '../ASN1Lexer';
import {k} from '../lexer/ASN1Keyword';

export function initReferencedTypeRules(this: ASN1CstParser) {
  this.RULE('ReferencedType', () => {
    // 17.3
    this.addOrList(['DefinedType', 'UsefulType']);
  });

  this.RULE('UsefulType', () => {
    // 17.3
    this.addOrTokenList([k.GeneralizedTime, k.UTCTime]);
  });

  this.RULE('DefinedType', () => {
    this.CONSUME(TypeReference);
  });
}
