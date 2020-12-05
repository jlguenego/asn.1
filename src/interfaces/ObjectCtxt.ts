import {Props} from './Props';

export interface ObjectCtxt {
  current: Props;
  length: number;
  index: number;
  parent?: ObjectCtxt;
}
