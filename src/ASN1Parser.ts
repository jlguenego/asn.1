import {Action} from './Action';
import {ActionType} from './actions/ActionType';
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
    const initialState: State = {
      dataview: new DataView(input),
      size: input.byteLength,
      index: 0,
      nextAction: ActionType.INIT,
      trees: [],
      pointer: undefined,
    };
    let state = initialState;
    while (state.nextAction) {
      Object.freeze(state); // make this state immutable
      const action = Action.get(state.nextAction);
      state = action.reduce(state);
    }
    return state.trees;
  }
}
