import {ActionType} from './actions/ActionType';
import {State} from './interfaces/State';

export abstract class Action {
  abstract type: ActionType;
  abstract reduce(state: State): State;

  clone(state: State): State {
    const result: State = {...state};
    result.nextAction = ActionType.NONE;
    return result;
  }
}
