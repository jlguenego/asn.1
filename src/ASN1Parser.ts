import {ActionFactory} from './actions/ActionFactory';
import {ActionType} from './actions/ActionType';
import {DERRegister} from './encoding-rules/der/DERRegistration';
import {EncodingRule} from './EncodingRule';
import {ASN1ParserOptions} from './interfaces';
import {State} from './interfaces/State';

export class ASN1Parser {
  options: ASN1ParserOptions = {
    encodingRule: EncodingRule.DER,
  };

  constructor(opts: Partial<ASN1ParserOptions>) {
    this.options = {...this.options, ...opts};
  }

  parse(input: ArrayBuffer): Object {
    this.register();
    const state: State = {
      dataview: new DataView(input),
      size: input.byteLength,
      index: 0,
      nextAction: ActionType.INIT,
      trees: [],
      context: undefined,
    };
    while (state.nextAction !== ActionType.NONE) {
      const action = ActionFactory.get(state.nextAction);
      action.transform(state);
    }
    return state.trees;
  }

  register() {
    if (this.options.encodingRule === EncodingRule.DER) {
      DERRegister();
    }
  }
}
