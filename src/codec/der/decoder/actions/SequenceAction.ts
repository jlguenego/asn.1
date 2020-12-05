import dbg from 'debug';
import {Action} from '../../../../Action';
import {ActionType} from '../../../../actions/ActionType';
import {ObjectCtxt} from '../../../../interfaces/ObjectCtxt';
import {State} from '../../../../interfaces/State';
import {readLengthOctets} from '../../../ber/decoder/misc';

const debug = dbg('asn.1:sequence');

export class SequenceAction extends Action {
  type = ActionType.SEQUENCE;
  transform(state: State): void {
    if (!state.context) {
      state.context = {
        current: {},
        length: -1,
        index: 0,
      };
      state.root = state.context.current;
    } else {
      // sequence inside sequence
    }

    const length = readLengthOctets(state);
    debug('length: ', length);
    const context = state.context;
    context.length = length;
    if (length === 0) {
      state.nextAction = ActionType.INIT;
      return;
    }
    state.nextAction = ActionType.ITEM;
  }
}
