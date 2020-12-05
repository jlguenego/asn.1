export class DERInput {
  dataview: DataView;
  index = 0;
  size: number;
  constructor(input: ArrayBuffer) {
    this.dataview = new DataView(input);
    this.size = this.dataview.byteLength;
  }

  readUint8() {
    const byte = this.dataview.getUint8(this.index);
    this.index += 1;
    return byte;
  }

  readString(length: number) {
    const buffer = this.dataview.buffer.slice(this.index, this.index + length);
    const value = Buffer.from(buffer).toString('ascii');
    this.index += length;
    return value;
  }
}
