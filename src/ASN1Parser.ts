import dbg from 'debug';

import {ActionFactory} from './actions/ActionFactory';
import {ActionType} from './actions/ActionType';
import {BERDecode} from './codec/ber/decoder/BERDecoder';
import {DERRegister} from './encoding-rules/der/DERRegistration';
import {EncodingRule} from './EncodingRule';
import {ASN1ParserOptions} from './interfaces';
import {ASN1Message} from './interfaces/ASN1Message';
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

  parse(input: ArrayBuffer): ASN1Message {
    if (
      [EncodingRule.BER, EncodingRule.CER, EncodingRule.DER].includes(
        this.options.encodingRule
      )
    ) {
      return BERDecode(input);
    }
    throw new Error(
      'Encoding rule not yet implemented: ' + this.options.encodingRule
    );
  }

  register() {
    if (this.options.encodingRule === EncodingRule.DER) {
      DERRegister();
    }
  }
}
