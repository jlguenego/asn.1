/*
BuiltinType ::=
BitStringType
| BooleanType
| CharacterStringType
| ChoiceType
| DateType
| DateTimeType
| DurationType
| EmbeddedPDVType
| EnumeratedType
| ExternalType
| InstanceOfType
| IntegerType
| IRIType
| NullType
| ObjectClassFieldType
| ObjectIdentifierType
| OctetStringType
| RealType
| RelativeIRIType
| RelativeOIDType
| SequenceType
| SequenceOfType
| SetType
| SetOfType
| PrefixedType
| TimeType
| TimeOfDayType
*/

export enum ActionType {
  NONE = 'none',
  INIT = 'init',
  OBJECT = 'object',
  ITEM = 'item',

  TYPE_BOOLEAN = 'type boolean', // x01
  TYPE_INTEGER = 'type integer', // x02
  TYPE_BIT_STRING = 'type bit string', // x03
  TYPE_OCTET_STRING = 'type octet string', // x04
  TYPE_NULL = 'type null', // x05
  TYPE_OBJECT_IDENTIFER = 'type Object Identifier', // x06

  TYPE_CHARACTERSTRING = 'type characterstring',
  TYPE_CHOICE = 'type choice',
  TYPE_DATE = 'type date',
  TYPE_DATETIME = 'type datetime',
  TYPE_DURATION = 'type duration',
  TYPE_IA5STRING = 'type IA5string',
  TYPE_T61STRING = 'type T61string',

  TYPE_PRINTABLE_STRING = 'type printable string',
  TYPE_UTCTIME = 'type utc time',
}
