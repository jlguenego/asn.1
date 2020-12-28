import {ASN1CstParser} from '../ASN1CstParser';
import {COMMA, Identifier, SEMI_COLUMN, TypeReference} from '../ASN1Lexer';
import {k} from '../lexer/ASN1Keyword';

export function initImportsRules(this: ASN1CstParser) {
  this.RULE('Imports', () => {
    this.OPTION(() => {
      this.CONSUME(k.IMPORTS);
      this.SUBRULE(this.SymbolsImported);
      this.CONSUME(SEMI_COLUMN);
    });
  });

  this.RULE('SymbolsImported', () => {
    this.OPTION(() => {
      this.SUBRULE(this.SymbolsFromModuleList);
    });
  });

  this.RULE('SymbolsFromModuleList', () => {
    this.MANY(() => {
      this.SUBRULE(this.SymbolsFromModule);
    });
  });

  this.RULE('SymbolsFromModule', () => {
    this.SUBRULE(this.SymbolList);
    this.CONSUME(k.FROM);
    this.SUBRULE(this.GlobalModuleReference);
  });

  this.RULE('SymbolList', () => {
    this.MANY_SEP({
      SEP: COMMA,
      DEF: () => {
        this.SUBRULE(this.Symbol);
      },
    });
  });

  this.RULE('Symbol', () => {
    this.addOrList([
      'Reference',
      // 'ParameterizedReference'
    ]);
  });
  this.RULE('Reference', () => {
    this.addOrTokenList([TypeReference, Identifier]);
  });

  this.RULE('GlobalModuleReference', () => {
    // module reference
    this.CONSUME(TypeReference);
    this.SUBRULE(this.AssignedIdentifier);
  });

  this.RULE('AssignedIdentifier', () => {
    this.addOrList(['ObjectIdentifierValue', 'DefinedValue']);
  });
}
