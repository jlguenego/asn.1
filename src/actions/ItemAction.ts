import {Action} from '../Action';
import {SequenceCtxt} from '../interfaces/SequenceCtxt';
import {State} from '../interfaces/State';
import {ActionType} from './ActionType';

const INTEGER = 0x02;
const IA5STRING = 0x16;

export class ItemAction extends Action {
  type = ActionType.ITEM;
  transform(state: State) {
    const context = state.context as SequenceCtxt;
    const type = state.dataview.getUint8(state.index);
    console.log('type: ', type);
    state.index++;
    context.index++;
    if (type === INTEGER) {
      state.nextAction = ActionType.ITEM_INTEGER;
      return;
    }
    if (type === IA5STRING) {
      state.nextAction = ActionType.ITEM_IA5STRING;
      return;
    }
    throw new Error('type not found (or implemented)');
  }
}
