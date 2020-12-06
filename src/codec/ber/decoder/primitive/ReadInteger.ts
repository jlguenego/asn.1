import {CursorDataView} from '../../../../CursorDataView';

export function readInteger(cdv: CursorDataView, length: number) {
  if (length === 0) {
    return null;
  }
  let result = 0;
  for (let i = 0; i < length; i++) {
    const v = cdv.read();
    result = result * 256 + v;
  }
  return result;
}
