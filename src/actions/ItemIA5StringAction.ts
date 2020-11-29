import {Action} from '../Action';
import {SequenceCtxt} from '../interfaces/SequenceCtxt';
import {State} from '../interfaces/State';
import {ActionType} from './ActionType';

export class ItemIA5StringAction extends Action {
  type = ActionType.ITEM_IA5STRING;
  transform(state: State): void {
    console.log('state: ', state);

    const context = state.context as SequenceCtxt;
    const length = state.dataview.getUint8(state.index);
    console.log('length: ', length);
    context.index++;
    state.index++;
    const buffer = state.dataview.buffer.slice(
      state.index,
      state.index + length
    );
    const value = Buffer.from(buffer).toString('ascii');
    const key = Object.keys(context.sequence).length;
    context.sequence[key] = value;
    context.index += length;
    state.index += length;
    console.log('state: ', state);

    if (context.index === context.length) {
      state.nextAction = ActionType.INIT;
      return;
    }
    state.nextAction = ActionType.ITEM;
  }
}
