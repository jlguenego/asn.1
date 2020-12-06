import {EncodingValue} from './interfaces/EncodingValue';

export class CursorDataView {
  dataview: DataView;
  index = 0;
  constructor(input: ArrayBuffer) {
    this.dataview = new DataView(input);
  }

  read() {
    const uint = this.dataview.getUint8(this.index);
    this.index += 1;
    return uint;
  }

  readString(length: number, encoding: EncodingValue = 'hex') {
    const buffer = this.dataview.buffer.slice(this.index, this.index + length);
    const value = Buffer.from(buffer).toString(encoding);
    this.index += length;
    return value;
  }
}
