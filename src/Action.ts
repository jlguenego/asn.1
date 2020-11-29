import {ActionType} from './actions/ActionType';
import {State} from './interfaces/State';

export abstract class Action {
  abstract type: ActionType;

  abstract transform(state: State): void;
}
