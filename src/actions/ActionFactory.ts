import assert from 'assert';
import {Action} from '../Action';
import {ActionType} from './ActionType';

export class ActionFactory {
  private static actions: {[key: string]: Action} = {};

  static get(type: ActionType): Action {
    const result = ActionFactory.actions[type];
    assert(
      result,
      'Cannot find the matching actions (not defined/registered in action types)'
    );
    return result;
  }

  static register(MyClass: new () => Action): void {
    const action = new MyClass();
    ActionFactory.actions[action.type] = action;
  }
}
