import {CursorDataView} from '../../../../CursorDataView';

export function readBoolean(cdv: CursorDataView, length: number) {
  if (length === 0) {
    return undefined;
  }
  if (length !== 1) {
    throw new Error('length must be 1');
  }
  const v = cdv.read();
  return v === 0x00 ? false : true;
}
