import {ActionType} from '../actions/ActionType';
import {EncodingRule} from '../EncodingRule';
import {ObjectCtxt} from './ObjectCtxt';
import {Props} from './Props';

export interface State {
  encodingRule: EncodingRule;
  dataview: DataView;
  size: number;
  index: number;
  nextAction: ActionType;
  root?: Props;
  context?: ObjectCtxt;
}
