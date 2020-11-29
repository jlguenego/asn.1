import {ActionType} from '../actions/ActionType';
import {Props} from './Props';

export interface State {
  dataview: DataView;
  size: number;
  index: number;
  nextAction: ActionType;
  trees: Props[];
  context: unknown;
}
