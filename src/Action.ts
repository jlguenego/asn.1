import {ActionType} from './actions/ActionType';
import {State} from './interfaces/State';

export abstract class Action {
  abstract type: ActionType;
  abstract reduce(state: State): State;

  static register(MyClass: new () => Action): void {
    Action.actions[MyClass.name] = new MyClass();
  }
  static get(type: ActionType): Action {
    return Action.actions[type];
  }
  private static actions: {[key: string]: Action} = {};
}
