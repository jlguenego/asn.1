import {ASN1CstParser} from '../ASN1CstParser';
import {
  COMMA,
  Identifier,
  INTEGER,
  L_CURLY,
  L_PARENTHESIS,
  NegativeNumberToken,
  NumberToken,
  R_CURLY,
  R_PARENTHESIS,
} from '../ASN1Lexer';

export function initIntegerTypeRules($: ASN1CstParser) {
  $.addRule('IntegerType', () => {
    $.addConsume(INTEGER);
    $.addOption(() => {
      $.addConsume(L_CURLY);
      $.addSubrule($.NamedNumberList);
      $.addConsume(R_CURLY);
    });
  });

  $.addRule('NamedNumberList', () => {
    $.addSubrule($.NamedNumber);
    $.addOption(() => {
      $.addConsume(COMMA);
      $.addSubrule($.NamedNumberList);
    });
  });

  $.addRule('NamedNumber', () => {
    $.addConsume(Identifier);
    $.addConsume(L_PARENTHESIS);
    $.addOrList(['SignedNumber', 'DefinedValue']);
    $.addConsume(R_PARENTHESIS);
  });

  $.addRule('SignedNumber', () => {
    $.addOr([
      {
        ALT: () => {
          $.addConsume(NumberToken);
        },
      },
      {
        ALT: () => {
          $.addConsume(NegativeNumberToken);
        },
      },
    ]);
  });
}
