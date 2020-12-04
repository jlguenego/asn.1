import dbg from 'debug';

import {ActionFactory} from './actions/ActionFactory';
import {ActionType} from './actions/ActionType';
import {DERRegister} from './encoding-rules/der/DERRegistration';
import {EncodingRule} from './EncodingRule';
import {ASN1ParserOptions} from './interfaces';
import {Props} from './interfaces/Props';
import {State} from './interfaces/State';

const debug = dbg('asn.1:parser');

export class ASN1Parser {
  options: ASN1ParserOptions = {
    encodingRule: EncodingRule.DER,
  };

  constructor(opts: Partial<ASN1ParserOptions>) {
    this.options = {...this.options, ...opts};
  }

  parse(input: ArrayBuffer): Props[] {
    this.register();
    const state: State = {
      encodingRule: this.options.encodingRule,
      dataview: new DataView(input),
      size: input.byteLength,
      index: 0,
      nextAction: ActionType.INIT,
      trees: [],
      context: {},
    };
    while (state.nextAction !== ActionType.NONE) {
      debug('state: ', state);

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
