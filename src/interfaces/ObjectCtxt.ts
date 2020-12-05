import {Props} from './Props';

export interface ObjectCtxt {
  sequence: Props;
  length: number;
  index: number;
  parent?: ObjectCtxt;
}
