import {Action} from '../Action';
import {Props} from '../interfaces/Props';
import {State} from '../interfaces/State';
import {ActionType} from './ActionType';

export class ItemIntegerAction extends Action {
  type = ActionType.ITEM_INTEGER;
  transform(state: State): void {
    const length = state.dataview.getUint8(state.index);
    console.log('length: ', length);
    state.index++;
    if (length === 1) {
      const value = state.dataview.getUint8(state.index);
      const context = state.context as {sequence: Props};
      const key = Object.keys(context).length;
      context.sequence[key] = value;
      state.nextAction = ActionType.NONE;
      return;
    }
    throw new Error('read integer length not understood');
  }
}
