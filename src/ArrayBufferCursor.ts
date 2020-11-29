export enum ItemType {
  Int8,
  Int16,
  Int32,
  Uint8,
  Uint16,
  Uint32,
  Float32,
  Float64,
  Float,
  Double,
}

export class ArrayBufferCursor {
  dataview: DataView;
  size: number;
  index: number;
  constructor(buffer: ArrayBuffer) {
    console.log('buffer: ', buffer);
    this.dataview = new DataView(buffer, 0);
    console.log('this.dataview: ', this.dataview);
    this.size = buffer.byteLength;
    console.log('this.size: ', this.size);
    this.index = 0;
    console.log('this.index: ', this.index);
  }

  next(type: ItemType) {
    switch (type) {
      case ItemType.Int8: {
        const result = this.dataview.getInt8(this.index);
        this.index += 1;
        return result;
      }
      case ItemType.Uint8: {
        const result = this.dataview.getUint8(this.index);
        this.index += 1;
        return result;
      }
      case ItemType.Int16: {
        const result = this.dataview.getInt16(this.index, true);
        this.index += 2;
        return result;
      }
      case ItemType.Uint16: {
        const result = this.dataview.getUint16(this.index, true);
        this.index += 2;
        return result;
      }
      case ItemType.Int32: {
        const result = this.dataview.getInt32(this.index, true);
        this.index += 4;
        return result;
      }
      case ItemType.Uint32: {
        const result = this.dataview.getUint32(this.index, true);
        this.index += 4;
        return result;
      }
      case ItemType.Float:
      case ItemType.Float32: {
        const result = this.dataview.getFloat32(this.index, true);
        this.index += 4;
        return result;
      }
      case ItemType.Double:
      case ItemType.Float64: {
        const result = this.dataview.getFloat64(this.index, true);
        this.index += 8;
        return result;
      }
    }
  }

  hasNext() {
    console.log('this.index: ', this.index);
    console.log('this.size: ', this.size);
    return this.index < this.size;
  }
}
