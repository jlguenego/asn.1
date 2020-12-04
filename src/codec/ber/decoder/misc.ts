import {Identifier} from './Identifier';
import {State} from '../../../interfaces/State';
import {TagClass} from '../../../interfaces/TagClass';

export function readUint8(state: State) {
  const byte = state.dataview.getUint8(state.index);
  state.index += 1;
  return byte;
}

export function readIdentifierOctets(state: State): Identifier {
  const result = new Identifier();
  const octet = readUint8(state);
  // (8.1.2.2 a)
  result.tagClass = getTagClass(octet);
  // (8.1.2.2 b)
  result.constructed = isConstructed(octet);
  // (8.1.2.4.1 c)
  result.tag = octet & 0b0001_1111;
  if (result.tag < 0b0001_1111) {
    return result;
  }
  // multi octets.
  let tagNumberStr = '';
  let octetN;
  while (true) {
    octetN = readUint8(state);
    // bit 7 to 1 (8.1.2.4.2 b)
    const str = (octetN & 0b0111_1111).toString(2);
    console.log('str: ', str);
    tagNumberStr += str;
    // last octet (8.1.2.4.2 a)
    if ((octetN & 0b1000_0000) === 0) {
      break;
    }
  }
  // (8.1.2.4.2 b) concactenation
  result.tag = parseInt(tagNumberStr, 2);
  return result;
}

export function readLengthOctets(state: State): number {
  const length = readUint8(state);
  // TODO: implement multi-octet version
  return length;
}

export function getTagClass(octet: number): TagClass {
  switch (octet >> 6) {
    case 0:
      return TagClass.UNIVERSAL;
    case 1:
      return TagClass.APPLICATION;
    case 2:
      return TagClass.CONTEXT_SPECIFIC;
    case 3:
      return TagClass.PRIVATE;
    default:
      throw new Error('octet should be < 128');
  }
}

export function isConstructed(octet: number): boolean {
  return (octet & 0b0010_0000) > 0;
}
