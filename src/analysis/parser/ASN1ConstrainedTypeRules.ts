import {ASN1CstParser} from '../ASN1CstParser';
import {
  L_PARENTHESIS,
  MAX,
  MIN,
  RANGE_SEPARATOR,
  R_PARENTHESIS,
} from '../ASN1Lexer';

export function initConstrainedTypeRules(this: ASN1CstParser) {
  this.RULE('ConstrainedType', () => {
    // 49.1
    //     Type Constraint
    // | TypeWithConstraint

    // chevrotain does not allow rules recursion.
    // this.addOr([
    //   {
    //     ALT: () => {
    this.SUBRULE(this.BuiltinType);
    this.OPTION(() => {
      this.SUBRULE(this.Constraint);
    });
    //   },
    // },
    // {
    //   ALT: () => {
    //     this.SUBRULE(this.TypeWithConstraint);
    //   },
    // },
    // ]);
  });

  this.RULE('Constraint', () => {
    // 49.6 Constraint ::= "(" ConstraintSpec ExceptionSpec ")"
    this.CONSUME(L_PARENTHESIS);
    this.SUBRULE(this.ConstraintSpec);
    // this.addSubrule(this.ExceptionSpec);
    this.CONSUME(R_PARENTHESIS);
  });
  this.RULE('ConstraintSpec', () => {
    // 49.6 ConstraintSpec ::=
    // SubtypeConstraint
    // | GeneralConstraint
    this.SUBRULE(this.SubtypeConstraint);
    this.SUBRULE(this.GeneralConstraint);
  });
  this.RULE('SubtypeConstraint', () => {
    this.SUBRULE(this.ElementSetSpecs);
  });
  this.RULE('ElementSetSpecs', () => {
    this.SUBRULE(this.ValueRange);
  });
  this.RULE('GeneralConstraint', () => {});
  this.RULE('ExceptionSpec', () => {});
  this.RULE('TypeWithConstraint', () => {});

  this.RULE('ValueRange', () => {
    this.SUBRULE(this.LowerEndpoint);
    this.CONSUME(RANGE_SEPARATOR);
    this.SUBRULE(this.UpperEndpoint);
  });
  this.RULE('LowerEndpoint', () => {
    this.SUBRULE(this.LowerEndValue);
  });
  this.RULE('UpperEndpoint', () => {
    this.SUBRULE(this.UpperEndValue);
  });
  this.RULE('LowerEndValue', () => {
    this.OR([
      {
        ALT: () => {
          this.SUBRULE(this.Value);
        },
      },
      {
        ALT: () => {
          this.CONSUME(MIN);
        },
      },
    ]);
  });
  this.RULE('UpperEndValue', () => {
    this.OR([
      {
        ALT: () => {
          this.SUBRULE(this.Value);
        },
      },
      {
        ALT: () => {
          this.CONSUME(MAX);
        },
      },
    ]);
  });
}
