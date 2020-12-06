import {CursorDataView} from '../../../../CursorDataView';

export function readObjectIdentifier(cdv: CursorDataView, length: number) {
  // encoding of an ordered list of subidentifiers, concatenated together (8.19.2)

  // Each subidentifier is represented as a series of (one or more) octets.

  // Bit 8 of each octet indicates whether it is the last in the series:
  // - bit 8 of the last octet is zero; bit 8 of each preceding octet is one.
  // - Bits 7 to 1 of the octets in the series collectively encode the subidentifier.
  const array = [] as number[];
  let subIdentifierValue = 0;
  for (let i = 0; i < length; i++) {
    const v = cdv.read();
    if (subIdentifierValue === 0) {
      // leading octet.
      if (v === 0x80) {
        throw new Error(
          'The subidentifier shall be encoded in the fewest possible octets. (8.19.2)'
        );
      }
    }
    const value = v & 0b0111_1111;
    // Conceptually, these groups of bits are concatenated to form an
    // unsigned binary number whose most significant bit is bit 7 of
    // the first octet and whose least significant bit is bit 1
    // of the last octet.
    subIdentifierValue = subIdentifierValue * 128 + value;
    if ((v & 0b1000_0000) === 0) {
      // last octet
      array.push(subIdentifierValue);
      subIdentifierValue = 0;
    }
  }

  // (8.19.3) The number of subidentifiers (N) shall be one less than
  // the number of object identifier components in the
  // object identifier value being encoded.

  // (8.19.4) The numerical value of the first subidentifier is derived
  // from the values of the first two object identifiercomponents
  // in the object identifier value being encoded, using the formula:
  // (X*40) + Y
  // where X is the value of the first object identifier component and Y is the value of the second object identifier
  // component.
  if (array.length === 0) {
    throw new Error('Object identifier must have at least one subidentifier');
  }
  const firstSubIdentifier = array.shift() as number;
  const y = firstSubIdentifier % 40;
  const x = (firstSubIdentifier - y) / 40;
  array.unshift(y);
  array.unshift(x);
  return array.join('.');
}
