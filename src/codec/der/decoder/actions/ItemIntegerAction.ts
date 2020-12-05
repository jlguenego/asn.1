import {Action} from '../../../../Action';
import {ActionType} from '../../../../actions/ActionType';
import {ObjectCtxt} from '../../../../interfaces/ObjectCtxt';
import {State} from '../../../../interfaces/State';

export class ItemIntegerAction extends Action {
  type = ActionType.TYPE_INTEGER;
  transform(state: State): void {
    const context = state.context as ObjectCtxt;
    const length = state.dataview.getUint8(state.index);
    state.index++;
    context.index++;
    if (length === 1) {
      const value = state.dataview.getUint8(state.index);
      state.index++;
      context.index++;
      const key = Object.keys(context.current).length;
      context.current[key] = value;
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
