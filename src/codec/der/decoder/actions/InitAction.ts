import {Action} from '../../../../Action';
import {ActionType} from '../../../../actions/ActionType';
import {SequenceCtxt} from '../../../../interfaces/SequenceCtxt';
import {State} from '../../../../interfaces/State';

const SEQUENCE = 0x30;
const APPLICATION_0_SEQUENCE = 0x60;

export class InitAction extends Action {
  type = ActionType.INIT;
  transform(state: State): void {
    if (state.index === state.size) {
      state.nextAction = ActionType.NONE;
      return;
    }
    const type = state.dataview.getUint8(state.index);
    if (type === SEQUENCE || type === APPLICATION_0_SEQUENCE) {
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
    throw new Error(`Unexpected Type: ${type.toString(16)}`);
  }
}
