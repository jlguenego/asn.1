import {CursorDataView} from '../../../../CursorDataView';

export function readIA5String(cdv: CursorDataView, length: number) {
  return cdv.readString(length, 'ascii');
}
