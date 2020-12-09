import {ASN1CstParser} from '../ASN1CstParser';
import {
  Identifier,
  L_CURLY,
  L_PARENTHESIS,
  NumberToken,
  R_CURLY,
  R_PARENTHESIS,
} from '../ASN1Lexer';

export function initObjectIdentifierValueRules($: ASN1CstParser) {
  $.addRule('ObjectIdentifierValue', () => {
    $.addOr([
      {
        ALT: () => {
          $.addConsume(L_CURLY);
          $.addSubrule($.ObjIdComponentsList);
          $.addConsume(R_CURLY);
        },
      },
    ]);
  });

  $.addRule('ObjIdComponentsList', () => {
    $.addMany(() => {
      $.addSubrule($.ObjIdComponents);
    });
  });

  $.addRule('ObjIdComponents', () => {
    $.addOr([
      {
        ALT: () => {
          $.addSubrule($.NameAndNumberForm);
        },
      },
    ]);
  });

  $.addRule('NameAndNumberForm', () => {
    $.addConsume(Identifier);
    $.addConsume(L_PARENTHESIS);
    $.addSubrule($.NumberForm);
    $.addConsume(R_PARENTHESIS);
  });

  $.addRule('NumberForm', () => {
    $.addOr([
      {
        ALT: () => {
          $.addConsume(NumberToken);
        },
      },
    ]);
  });
}
