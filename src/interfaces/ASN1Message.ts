import {LengthType} from './LengthType';
import {TagClass} from './TagClass';

export interface ASN1Message {
  tagClass: TagClass;
  isConstructed: boolean;
  tagCode: number;
  tagLabel: string;
  lengthType: LengthType;
  length: number;
  value: ASN1Type;
}

export type ASN1PrimitiveType = string | number | boolean | undefined;

export type ASN1Type = ASN1Message[] | ASN1PrimitiveType;
