import {ActionFactory} from '../../actions/ActionFactory';
import {InitAction} from '../../codec/der/decoder/actions/InitAction';
import {ItemAction} from '../../codec/der/decoder/actions/ItemAction';
import {ItemIA5StringAction} from '../../codec/der/decoder/actions/ItemIA5StringAction';
import {ItemIntegerAction} from '../../codec/der/decoder/actions/ItemIntegerAction';
import {SequenceAction} from '../../codec/der/decoder/actions/SequenceAction';

export function DERRegister() {
  ActionFactory.register(InitAction);
  ActionFactory.register(SequenceAction);
  ActionFactory.register(ItemAction);
  ActionFactory.register(ItemIntegerAction);
  ActionFactory.register(ItemIA5StringAction);
}
