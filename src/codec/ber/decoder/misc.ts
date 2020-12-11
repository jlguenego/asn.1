import {TagClass} from '../../../interfaces/TagClass';

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
