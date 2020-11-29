import {Action} from '../Action';
import {State} from '../interfaces/State';
import {ActionType} from './ActionType';

const INTEGER = 0x02;

export class ItemAction extends Action {
  type = ActionType.ITEM;
  transform(state: State) {
    const type = state.dataview.getUint8(state.index);
    console.log('type: ', type);
    state.index++;
    if (type === INTEGER) {
      state.nextAction = ActionType.ITEM_INTEGER;
      return;
    }
    throw new Error('type not found (or implemented)');
  }
}
