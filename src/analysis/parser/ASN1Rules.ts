import {ASN1CstParser} from '../ASN1CstParser';
import {COMMA, Identifier} from '../ASN1Lexer';

export function initRules($: ASN1CstParser) {
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
