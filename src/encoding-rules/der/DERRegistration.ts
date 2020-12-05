import {ActionFactory} from '../../actions/ActionFactory';
import {InitAction} from '../../codec/der/decoder/actions/InitAction';
import {ItemAction} from '../../codec/der/decoder/actions/ItemAction';
import {ItemBooleanAction} from '../../codec/der/decoder/actions/ItemBooleanAction';
import {ItemIA5StringAction} from '../../codec/der/decoder/actions/ItemIA5StringAction';
import {ItemIntegerAction} from '../../codec/der/decoder/actions/ItemIntegerAction';
import {ObjectAction} from '../../codec/der/decoder/actions/ObjectAction';

export function DERRegister() {
  ActionFactory.register(InitAction);
  ActionFactory.register(ObjectAction);
  ActionFactory.register(ItemAction);
  ActionFactory.register(ItemBooleanAction);
  ActionFactory.register(ItemIntegerAction);
  ActionFactory.register(ItemIA5StringAction);
}
