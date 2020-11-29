import {ActionType} from './actions/ActionType';
import {State} from './interfaces/State';

export abstract class Action {
  abstract type: ActionType;

  abstract transform(state: State): void;

  reduce(state: State): State {
    const newState: State = {...state};
    newState.nextAction = ActionType.NONE;
    this.transform(newState);
    return newState;
  }
}
