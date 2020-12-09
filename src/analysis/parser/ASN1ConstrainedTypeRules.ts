import {ASN1CstParser} from '../ASN1CstParser';
import {
  L_PARENTHESIS,
  MAX,
  MIN,
  RANGE_SEPARATOR,
  R_PARENTHESIS,
} from '../ASN1Lexer';

export function initConstrainedTypeRules($: ASN1CstParser) {
  $.addRule('ConstrainedType', () => {
    // 49.1
    //     Type Constraint
    // | TypeWithConstraint

    // chevrotain does not allow rules recursion.
    // $.addOr([
    //   {
    //     ALT: () => {
    $.addSubrule($.BuiltinType);
    $.addOption(() => {
      $.addSubrule($.Constraint);
    });
    //   },
    // },
    // {
    //   ALT: () => {
    //     $.addSubrule($.TypeWithConstraint);
    //   },
    // },
    // ]);
  });

  $.addRule('Constraint', () => {
    // 49.6 Constraint ::= "(" ConstraintSpec ExceptionSpec ")"
    $.addConsume(L_PARENTHESIS);
    $.addSubrule($.ConstraintSpec);
    // $.addSubrule($.ExceptionSpec);
    $.addConsume(R_PARENTHESIS);
  });
  $.addRule('ConstraintSpec', () => {
    // 49.6 ConstraintSpec ::=
    // SubtypeConstraint
    // | GeneralConstraint
    $.addSubrule($.SubtypeConstraint);
    $.addSubrule($.GeneralConstraint);
  });
  $.addRule('SubtypeConstraint', () => {
    $.addSubrule($.ElementSetSpecs);
  });
  $.addRule('ElementSetSpecs', () => {
    $.addSubrule($.ValueRange);
  });
  $.addRule('GeneralConstraint', () => {});
  $.addRule('ExceptionSpec', () => {});
  $.addRule('TypeWithConstraint', () => {});

  $.addRule('ValueRange', () => {
    $.addSubrule($.LowerEndpoint);
    $.addConsume(RANGE_SEPARATOR);
    $.addSubrule($.UpperEndpoint);
  });
  $.addRule('LowerEndpoint', () => {
    $.addSubrule($.LowerEndValue);
  });
  $.addRule('UpperEndpoint', () => {
    $.addSubrule($.UpperEndValue);
  });
  $.addRule('LowerEndValue', () => {
    $.addOr([
      {
        ALT: () => {
          $.addSubrule($.Value);
        },
      },
      {
        ALT: () => {
          $.addConsume(MIN);
        },
      },
    ]);
  });
  $.addRule('UpperEndValue', () => {
    $.addOr([
      {
        ALT: () => {
          $.addSubrule($.Value);
        },
      },
      {
        ALT: () => {
          $.addConsume(MAX);
        },
      },
    ]);
  });
}
