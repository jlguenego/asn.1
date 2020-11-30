import {ActionType} from '../actions/ActionType';
import {EncodingRule} from '../EncodingRule';
import {Props} from './Props';

export interface State {
  encodingRule: EncodingRule;
  dataview: DataView;
  size: number;
  index: number;
  nextAction: ActionType;
  trees: Props[];
  context: unknown;
}
