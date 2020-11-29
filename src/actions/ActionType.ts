import {Action} from '../Action';
import {InitAction} from './InitAction';
import {SequenceAction} from './SequenceAction';

export enum ActionType {
  NONE,
  INIT,
  SEQUENCE,
}

Action.register(InitAction);
Action.register(SequenceAction);
