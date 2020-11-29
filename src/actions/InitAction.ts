import {Action} from '../Action';
import {State} from '../interfaces/State';
import {ActionType} from './ActionType';

const SEQUENCE = 0x30;

export class InitAction extends Action {
  type = ActionType.INIT;
  reduce(state: State): State {
    const type = state.dataview.getUint8(state.index);
    if (type === SEQUENCE) {
      const newState = {...state};
      const sequence = {};
      newState.pointer = sequence;
      newState.trees = [...state.trees];
      newState.trees.push(sequence);
      state.nextAction = ActionType.SEQUENCE;
      newState.index += 1;

      return state;
    } else {
      throw new Error('Unexpected Type');
    }
  }
}

Action.register(InitAction);
