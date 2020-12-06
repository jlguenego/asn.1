import {CursorDataView} from '../../../../CursorDataView';

export function readOctetString(cdv: CursorDataView, length: number) {
  return cdv.readString(length, 'hex');
}
