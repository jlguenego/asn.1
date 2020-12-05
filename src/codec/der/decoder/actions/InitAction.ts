import util from 'util';

import {Action} from '../../../../Action';
import {ActionType} from '../../../../actions/ActionType';
import {State} from '../../../../interfaces/State';
import {TagClass} from '../../../../interfaces/TagClass';
import {readIdentifierOctets} from '../../../ber/decoder/misc';

const SEQUENCE = 0x10;

export class InitAction extends Action {
  type = ActionType.INIT;
  transform(state: State): void {
    if (state.index === state.size) {
      state.nextAction = ActionType.NONE;
      return;
    }
    const identifier = readIdentifierOctets(state);

    if (identifier.tagClass === TagClass.UNIVERSAL) {
      if (identifier.tag === SEQUENCE) {
        state.nextAction = ActionType.OBJECT;
        return;
      }
    }
    if (identifier.tagClass !== TagClass.UNIVERSAL) {
      state.nextAction = ActionType.OBJECT;
      return;
    }

    throw new Error(
      `Unexpected Identifier: ${util.inspect(identifier, false, null, true)}`
    );
  }
}
