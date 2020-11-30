import {CstParser} from 'chevrotain';

import {
  allASN1Tokens,
  Assignment,
  Begin,
  Definitions,
  End,
  Identifier,
} from './ASN1Token';

export class ASN1Parser extends CstParser {
  constructor() {
    super(allASN1Tokens);

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const $ = this;

    /*

    ModuleDefinition ::=
ModuleIdentifier
DEFINITIONS
EncodingReferenceDefault
TagDefault
ExtensionDefault
"::="
BEGIN
ModuleBody
EncodingControlSections
END
*/

    $.RULE('ModuleDefinition', () => {
      $.CONSUME(Identifier);
      $.CONSUME(Definitions);
      $.CONSUME(Assignment);
      $.CONSUME(Begin);
      $.SUBRULE($.ModuleBody);
      $.CONSUME(End);
    });

    $.RULE('ModuleBody', () => {
      $.CONSUME(Identifier);
    });

    this.performSelfAnalysis();
  }
}
