import {CursorDataView} from '../../../../CursorDataView';

export function readObjectIdentifier(cdv: CursorDataView, length: number) {
  return cdv.readString(length, 'hex');
}
