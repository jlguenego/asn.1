import {ASN1CstParser} from '../ASN1CstParser';
import {
  L_PARENTHESIS,
  PIPE,
  RANGE_SEPARATOR,
  R_PARENTHESIS,
} from '../ASN1Lexer';
import {k} from '../lexer/ASN1Keyword';

export function initConstrainedTypeRules(this: ASN1CstParser) {
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
    this.SUBRULE(this.RootElementSetSpec);
  });
  this.RULE('RootElementSetSpec', () => {
    this.SUBRULE(this.ElementSetSpec);
  });
  this.RULE('ElementSetSpec', () => {
    this.SUBRULE(this.Unions);
  });
  this.RULE('Unions', () => {
    this.SUBRULE(this.Elements);
    this.MANY(() => {
      this.SUBRULE(this.UnionMark);
      this.SUBRULE2(this.Elements);
    });
  });
  this.RULE('UnionMark', () => {
    this.CONSUME(PIPE);
  });
  this.RULE('Elements', () => {
    this.SUBRULE(this.SubtypeElements);
  });
  this.RULE('SubtypeElements', () => {
    this.addOrList(['ContainedSubType', 'SizeConstraint', 'ValueRange']);
  });

  this.RULE('SingleValue', () => {
    this.SUBRULE(this.Value);
  });

  this.RULE('ContainedSubType', () => {
    this.SUBRULE(this.Type);
  });

  this.RULE('GeneralConstraint', () => {});
  this.RULE('ExceptionSpec', () => {});
  this.RULE('TypeWithConstraint', () => {
    this.addOrTokenList([k.SEQUENCE, k.SET]);
    this.OR2([
      {
        ALT: () => {
          this.SUBRULE(this.Constraint);
        },
      },
      {
        ALT: () => {
          this.SUBRULE(this.SizeConstraint);
        },
      },
    ]);
    this.CONSUME(k.OF);
    this.OR3([
      {
        ALT: () => {
          this.SUBRULE(this.Type);
        },
      },
      {
        ALT: () => {
          this.SUBRULE(this.NamedType);
        },
      },
    ]);
  });

  this.RULE('ValueRange', () => {
    // Refactored: ValueRange include SingleValue
    this.SUBRULE(this.LowerEndpoint);
    this.OPTION(() => {
      this.CONSUME(RANGE_SEPARATOR);
      this.SUBRULE(this.UpperEndpoint);
    });
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
          this.CONSUME(k.MIN);
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
          this.CONSUME(k.MAX);
        },
      },
    ]);
  });
}
