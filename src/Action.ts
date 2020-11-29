import {ActionType} from './actions/ActionType';
import {deepFreeze} from './deepFreeze';
import {Props} from './interfaces/Props';
import {State} from './interfaces/State';

export abstract class Action {
  abstract type: ActionType;

  abstract transform(state: State): void;

  reduce(state: State): State {
    deepFreeze((state as unknown) as Props); // make this state immutable
    const newState: State = {...state};
    newState.nextAction = ActionType.NONE;
    this.transform(newState);
    return newState;
  }
}
