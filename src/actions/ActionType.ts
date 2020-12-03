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
  SEQUENCE = 'sequence',
  ITEM = 'item',

  TYPE_BOOLEAN = 'type boolean',
  TYPE_CHARACTERSTRING = 'type characterstring',
  TYPE_CHOICE = 'type choice',
  TYPE_DATE = 'type date',
  TYPE_DATETIME = 'type datetime',
  TYPE_DURATION = 'type duration',
  TYPE_INTEGER = 'type integer',
  TYPE_IA5STRING = 'type IA5string',
  TYPE_T61STRING = 'type T61string',
  TYPE_OBJECT_IDENTIFER = 'type Object Identifier',
  TYPE_BIT_STRING = 'type bit string',
  TYPE_OCTET_STRING = 'type octet string',
  TYPE_PRINTABLE_STRING = 'type printable string',
  TYPE_UTCTIME = 'type utc time',
  TYPE_NULL = 'type null',
}
