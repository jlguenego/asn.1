import {Action} from '../../../../Action';
import {ActionType} from '../../../../actions/ActionType';
import {ObjectCtxt} from '../../../../interfaces/ObjectCtxt';
import {State} from '../../../../interfaces/State';

const BOOLEAN = 0x01;
const INTEGER = 0x02;
const IA5STRING = 0x16;
const OBJECT_IDENTIFIER = 0x06;

export class ItemAction extends Action {
  type = ActionType.ITEM;
  transform(state: State) {
    const context = state.context as ObjectCtxt;
    const type = state.dataview.getUint8(state.index);
    state.index++;
    context.index++;
    if (type === BOOLEAN) {
      state.nextAction = ActionType.TYPE_BOOLEAN;
      return;
    }
    if (type === INTEGER) {
      state.nextAction = ActionType.TYPE_INTEGER;
      return;
    }
    if (type === IA5STRING) {
      state.nextAction = ActionType.TYPE_IA5STRING;
      return;
    }
    if (type === OBJECT_IDENTIFIER) {
      // state.nextAction = ActionType.ITEM_OBJECT_IDENTIFIER;
      throw new Error(`OBJECT_IDENTIFIER: ${type.toString(16)}`);
    }
    throw new Error(`type not found (or implemented): ${type.toString(16)}`);
  }
}
