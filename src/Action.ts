import assert from 'assert';
import {ActionType} from './actions/ActionType';
import {State} from './interfaces/State';

export abstract class Action {
  abstract type: ActionType;
  abstract reduce(state: State): State;

  static register(MyClass: new () => Action): void {
    const action = new MyClass();
    Action.actions[action.type] = action;
    console.log('Action.actions: ', Action.actions);
  }
  static get(type: ActionType): Action {
    const result = Action.actions[type];
    assert(result);
    return result;
  }
  private static actions: {[key: string]: Action} = {};
}
