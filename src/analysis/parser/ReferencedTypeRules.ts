import {ASN1CstParser} from '../ASN1CstParser';
import {TypeReference} from '../ASN1Lexer';

export function initReferencedTypeRules(this: ASN1CstParser) {
  this.RULE('ReferencedType', () => {
    // 17.3
    this.addOrList(['DefinedType']);
  });

  this.RULE('DefinedType', () => {
    this.CONSUME(TypeReference);
  });
}
