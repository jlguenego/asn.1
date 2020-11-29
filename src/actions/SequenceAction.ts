import {Action} from '../Action';
import {SequenceCtxt} from '../interfaces/SequenceCtxt';
import {State} from '../interfaces/State';
import {ActionType} from './ActionType';

export class SequenceAction extends Action {
  type = ActionType.SEQUENCE;
  transform(state: State): void {
    const length = state.dataview.getUint8(state.index);
    state.index++;
    const context = state.context as SequenceCtxt;
    context.length = length;
    if (length === 0) {
      state.nextAction = ActionType.INIT;
      return;
    }
    state.nextAction = ActionType.ITEM;
  }
}
