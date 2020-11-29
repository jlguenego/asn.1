import assert from 'assert';
import {Action} from '../Action';
import {ActionType} from './ActionType';
import {InitAction} from './InitAction';
import {SequenceAction} from './SequenceAction';

export class ActionFactory {
  private static actions: {[key: string]: Action} = {};

  static get(type: ActionType): Action {
    const result = ActionFactory.actions[type];
    assert(result);
    return result;
  }

  static register(MyClass: new () => Action): void {
    const action = new MyClass();
    ActionFactory.actions[action.type] = action;
  }
}

ActionFactory.register(InitAction);
ActionFactory.register(SequenceAction);
