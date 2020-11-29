import {Action} from '../../../Action';
import {ActionType} from '../../../actions/ActionType';
import {SequenceCtxt} from '../../../interfaces/SequenceCtxt';
import {State} from '../../../interfaces/State';

export class ItemIntegerAction extends Action {
  type = ActionType.ITEM_INTEGER;
  transform(state: State): void {
    const context = state.context as SequenceCtxt;
    const length = state.dataview.getUint8(state.index);
    state.index++;
    context.index++;
    if (length === 1) {
      const value = state.dataview.getUint8(state.index);
      state.index++;
      context.index++;
      const key = Object.keys(context.sequence).length;
      context.sequence[key] = value;
    } else {
      throw new Error('read integer length not understood');
    }
    if (context.index === context.length) {
      state.nextAction = ActionType.INIT;
      return;
    }
    state.nextAction = ActionType.ITEM;
  }
}
