import {Action} from '../../../../Action';
import {ActionType} from '../../../../actions/ActionType';
import {ObjectCtxt} from '../../../../interfaces/ObjectCtxt';
import {State} from '../../../../interfaces/State';

export class ItemIA5StringAction extends Action {
  type = ActionType.TYPE_IA5STRING;
  transform(state: State): void {
    const context = state.context as ObjectCtxt;
    const length = state.dataview.getUint8(state.index);
    context.index++;
    state.index++;
    const buffer = state.dataview.buffer.slice(
      state.index,
      state.index + length
    );
    const value = Buffer.from(buffer).toString('ascii');
    const key = Object.keys(context.current).length;
    context.current[key] = value;
    context.index += length;
    state.index += length;
    if (context.index === context.length) {
      state.nextAction = ActionType.INIT;
      return;
    }
    state.nextAction = ActionType.ITEM;
  }
}
