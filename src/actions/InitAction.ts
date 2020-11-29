import {Action} from '../Action';
import {SequenceCtxt} from '../interfaces/SequenceCtxt';
import {State} from '../interfaces/State';
import {ActionType} from './ActionType';

const SEQUENCE = 0x30;

export class InitAction extends Action {
  type = ActionType.INIT;
  transform(state: State): void {
    if (state.index === state.size) {
      state.nextAction = ActionType.NONE;
      return;
    }
    const type = state.dataview.getUint8(state.index);
    if (type === SEQUENCE) {
      const sequence = {};
      state.context = {
        sequence: sequence,
        length: -1,
        index: 0,
      } as SequenceCtxt;
      state.trees.push(sequence);
      state.nextAction = ActionType.SEQUENCE;
      state.index += 1;
      return;
    }
    throw new Error('Unexpected Type');
  }
}
