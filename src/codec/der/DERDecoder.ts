import {Props, PropsItem} from '../../interfaces/Props';
import {TagUniversal} from '../../interfaces/TagUniversal';
import {Identifier} from '../ber/decoder/Identifier';
import {getTagClass, isConstructed} from '../ber/decoder/misc';
import {DERInput} from './decoder/DERInput';
import {readBoolean} from './decoder/primitive/ReadBoolean';
import {readIA5String} from './decoder/primitive/ReadIA5String';
import {readObjectIdentifier} from './decoder/primitive/ReadObjectIdentifier';
import {readInteger} from './decoder/primitive/ReadInteger';
import {readBitString} from './decoder/primitive/ReadBitString';

export class DERDecoder {
  derInput: DERInput;
  constructor(input: ArrayBuffer) {
    this.derInput = new DERInput(input);
  }

  decode(): PropsItem {
    const identifier = this.readIdentifierOctets();
    if (identifier.isComposed()) {
      return this.readComposed();
    }
    return this.readSimple(identifier);
  }

  readComposed(): Props {
    const result: Props = {};
    let key = 0;
    const length = this.readLengthOctets();
    if (length === 0) {
      return result;
    }
    const max = this.derInput.index + length;
    while (this.derInput.index < max) {
      const identifier = this.readIdentifierOctets();
      if (identifier.isComposed()) {
        result[key] = this.readComposed();
        key++;
        continue;
      }
      result[key] = this.readSimple(identifier);
      key++;
    }
    return result;
  }

  read() {
    return this.derInput.readUint8();
  }
  readString(length: number) {
    return this.derInput.readString(length);
  }

  readIdentifierOctets(): Identifier {
    const result = new Identifier();
    const octet = this.read();
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
      octetN = this.read();
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

  readLengthOctets(): number {
    const length = this.read();
    // (8.1.3.4): one octet case
    if ((length & 0b1000_0000) === 0) {
      return length;
    }
    // (8.1.3.5 b)
    let result = 0;
    for (let i = 0; i < length - 0b1000_0000; i++) {
      const nbr = this.read();
      result = result * 256 + nbr;
    }
    return result;
  }

  readSimple(identifier: Identifier): PropsItem {
    const length = this.readLengthOctets();
    if (identifier.tag === TagUniversal.BOOLEAN) {
      return readBoolean(this, length);
    }
    if (identifier.tag === TagUniversal.INTEGER) {
      return readInteger(this, length);
    }
    if (identifier.tag === TagUniversal.BIT_STRING) {
      return readBitString(this, length);
    }
    if (identifier.tag === TagUniversal.OCTET_STRING) {
      return readIA5String(this, length);
    }
    if (identifier.tag === TagUniversal.OBJECT_IDENTIFIER) {
      return readObjectIdentifier(this, length);
    }
    if (identifier.tag === TagUniversal.IA5STRING) {
      return readIA5String(this, length);
    }
    if (identifier.tag === TagUniversal.GENERAL_STRING) {
      return readIA5String(this, length);
    }
    throw new Error(
      `cannot understand the identifier tag number: ${identifier.tag}`
    );
  }
}
