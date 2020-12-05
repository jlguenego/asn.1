import dbg from 'debug';

import {ActionFactory} from './actions/ActionFactory';
import {ActionType} from './actions/ActionType';
import {DERDecoder} from './codec/der/DERDecoder';
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

  parseOld(input: ArrayBuffer): Props {
    this.register();
    const state: State = {
      encodingRule: this.options.encodingRule,
      dataview: new DataView(input),
      size: input.byteLength,
      index: 0,
      nextAction: ActionType.INIT,
      root: undefined,
      context: undefined,
    };
    while (state.nextAction !== ActionType.NONE) {
      debug('state: ', state);

      const action = ActionFactory.get(state.nextAction);
      action.transform(state);
    }
    if (!state.root) {
      throw new Error('The parser did not return a valid state.root');
    }
    return state.root;
  }

  parse(input: ArrayBuffer): Props {
    const decoder = new DERDecoder(input);
    return decoder.decode() as Props;
  }

  register() {
    if (this.options.encodingRule === EncodingRule.DER) {
      DERRegister();
    }
  }
}
