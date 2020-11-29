import {Action} from '../Action';
import {State} from '../interfaces/State';
import {ActionType} from './ActionType';

const SEQUENCE = 0x30;

export class InitAction extends Action {
  type = ActionType.INIT;
  transform(state: State): State {
    const type = state.dataview.getUint8(state.index);
    console.log('type: ', type);
    console.log('SEQUENCE: ', SEQUENCE);
    if (type === SEQUENCE) {
      const sequence = {};
      state.pointer = sequence;
      state.trees = [...state.trees];
      state.trees.push(sequence);
      state.nextAction = ActionType.SEQUENCE;
      state.index += 1;

      return state;
    } else {
      throw new Error('Unexpected Type');
    }
  }
}
