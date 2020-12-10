import {ASN1CstParser} from '../ASN1CstParser';
import {AFFECTATION, TypeReference} from '../ASN1Lexer';

export function initTypeRules(this: ASN1CstParser) {
  this.RULE('TypeAssignment', () => {
    // 16.1
    this.CONSUME(TypeReference);
    this.CONSUME(AFFECTATION);
    this.SUBRULE(this.Type);
  });

  this.RULE('Type', () => {
    this.addOrList(['ConstrainedType', 'ReferencedType']);
  });

  this.RULE('ConstrainedType', () => {
    // chevrotain does not allow rules recursion.
    // 49.1

    this.SUBRULE(this.BuiltinType);
    this.OPTION(() => {
      this.SUBRULE(this.Constraint);
    });
  });

  this.RULE('BuiltinType', () => {
    this.addOrList([
      'BooleanType',
      'ObjectIdentifierType',
      'CharacterStringType',
      'IntegerType',
      'SequenceType',
      'PrefixedType',
    ]);
  });

  this.RULE('PrefixedType', () => {
    this.SUBRULE(this.TaggedType);
  });
}
