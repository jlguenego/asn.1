import {Action} from '../../../../Action';
import {ActionType} from '../../../../actions/ActionType';
import {SequenceCtxt} from '../../../../interfaces/SequenceCtxt';
import {State} from '../../../../interfaces/State';

export class SequenceAction extends Action {
  type = ActionType.SEQUENCE;
  transform(state: State): void {
    const sequence = {};
    state.context = {
      sequence: sequence,
      length: -1,
      index: 0,
    } as SequenceCtxt;
    state.trees.push(sequence);

    const length = state.dataview.getUint8(state.index);
    state.index++;
    const context = state.context as SequenceCtxt;
    context.length = length;
    if (length === 0) {
      state.nextAction = ActionType.INIT;
      return;
    }
    state.nextAction = ActionType.ITEM;
  }
}
