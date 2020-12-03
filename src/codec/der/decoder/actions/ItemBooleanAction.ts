import {Action} from '../../../../Action';
import {ActionType} from '../../../../actions/ActionType';
import {SequenceCtxt} from '../../../../interfaces/SequenceCtxt';
import {State} from '../../../../interfaces/State';

export class ItemBooleanAction extends Action {
  type = ActionType.TYPE_BOOLEAN;
  transform(state: State): void {
    const context = state.context as SequenceCtxt;
    const length = state.dataview.getUint8(state.index);
    state.index++;
    context.index++;
    if (length !== 1) {
      throw new Error('read boolean length must be one');
    }
    const value = state.dataview.getUint8(state.index);
    state.index++;
    context.index++;
    const key = Object.keys(context.sequence).length;
    // X.690 (8.2.2 and 11.1)
    if (value !== 0 && value !== 0b1111_1111) {
      throw new Error('This DER message do not respect X.690 11.1 clause');
    }
    context.sequence[key] = value !== 0;

    if (context.index === context.length) {
      // finish to read the sequence
      // should pop the state.
      state.nextAction = ActionType.INIT;
      return;
    }
    state.nextAction = ActionType.ITEM;
  }
}
