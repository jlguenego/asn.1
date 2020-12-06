import {CursorDataView} from '../../../../CursorDataView';
import {formatBitString} from '../../../../misc';

export function readBitString(cdv: CursorDataView, length: number) {
  // 8.6 Encoding of a bitstring value

  // 8.6.1 The encoding of a bitstring value shall be either primitive
  // or constructed at the option of the sender.

  // 8.6.2 The contents octets for the primitive encoding shall contain
  // an initial octet followed by zero, one or more subsequent octets.
  if (length === 0) {
    throw new Error('A bit string must have an initial octet (8.6.2)');
  }

  // 8.6.2.1 The bits in the bitstring value, commencing with the leading
  //  bit and proceeding to the trailing bit, shall be placed in
  //  bits 8 to 1 of the first subsequent octet, followed by bits 8 to 1
  // of the second subsequent octet, followed by bits 8 to 1 of each octet
  // in turn, followed by as many bits as are needed of the final subsequent
  // octet, commencing with bit 8.

  // 8.6.2.2 The initial octet shall encode, as an unsigned binary integer
  // with bit 1 as the least significant bit, the number of unused bits in
  // the final subsequent octet.
  // The number shall be in the range zero to seven.
  const initialOctet = cdv.read();
  if (initialOctet > 7) {
    throw new Error('initial octet cannot be more than 7.');
  }

  if (length === 1) {
    if (initialOctet !== 0) {
      // 8.6.2.3 If the bitstring is empty, there shall be no
      // subsequent octets, and the initial octet shall be zero
      throw new Error(
        'The initial octet is zero, this bitstring should be empty'
      );
    }
  }

  let value = '';
  for (let i = 0; i < length - 1; i++) {
    const v = cdv.read();
    value += v.toString(2).padStart(8, '0');
  }
  // remove the unused bit.
  value = value.substring(0, value.length - initialOctet);

  return formatBitString(value);
}
