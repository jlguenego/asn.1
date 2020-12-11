import {ASN1Message} from './interfaces/ASN1Message';

export class ASN1MsgUtils {
  static query(
    msg: ASN1Message,
    key: keyof ASN1Message,
    value: string
  ): ASN1Message | null {
    if (msg[key] === value) {
      return msg;
    }
    if (msg.value instanceof Array) {
      for (const v of msg.value as ASN1Message[]) {
        const result = ASN1MsgUtils.query(v, key, value);
        if (result !== null) {
          return result;
        }
      }
    }
    return null;
  }
}
