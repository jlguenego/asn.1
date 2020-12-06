import {CursorDataView} from '../../../../CursorDataView';

export function readBitString(cdv: CursorDataView, length: number) {
  return cdv.readString(length, 'hex');
}
