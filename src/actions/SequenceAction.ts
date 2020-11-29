import {Action} from '../Action';
import {State} from '../interfaces/State';
import {ActionType} from './ActionType';

export class SequenceAction extends Action {
  type = ActionType.SEQUENCE;
  transform(state: State): State {
    const length = state.dataview.getUint8(state.index);
    console.log('length: ', length);
    return state;
  }
}
