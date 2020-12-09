import {ASN1CstParser} from '../ASN1CstParser';
import {COMMA, Identifier, L_CURLY, R_CURLY, SEQUENCE} from '../ASN1Lexer';

export function initRules($: ASN1CstParser) {
  $.addRule('SequenceType', () => {
    $.addOr([
      {
        ALT: () => {
          $.addConsume(SEQUENCE);
          $.addConsume(L_CURLY);
          $.addOption(() => {
            $.addSubrule($.ComponentTypeLists);
          });
          $.addConsume(R_CURLY);
        },
      },
    ]);
  });

  $.addRule('ComponentTypeLists', () => {
    $.addOr([
      {
        ALT: () => {
          $.addSubrule($.ComponentTypeList);
        },
      },
    ]);
  });

  $.addRule('ComponentTypeList', () => {
    $.addSubrule($.ComponentType);
    $.addOption(() => {
      $.addConsume(COMMA);
      $.addSubrule($.ComponentTypeList);
    });
  });

  $.addRule('ComponentType', () => {
    $.addOr([
      {
        ALT: () => {
          $.addSubrule($.NamedType);
        },
      },
    ]);
  });

  $.addRule('NamedType', () => {
    $.addConsume(Identifier);
    $.addSubrule($.Type);
  });
}
