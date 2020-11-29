import {ActionFactory} from '../../actions/ActionFactory';
import {InitAction} from './actions/InitAction';
import {ItemAction} from './actions/ItemAction';
import {ItemIA5StringAction} from './actions/ItemIA5StringAction';
import {ItemIntegerAction} from './actions/ItemIntegerAction';
import {SequenceAction} from './actions/SequenceAction';

export function DERRegister() {
  ActionFactory.register(InitAction);
  ActionFactory.register(SequenceAction);
  ActionFactory.register(ItemAction);
  ActionFactory.register(ItemIntegerAction);
  ActionFactory.register(ItemIA5StringAction);
}
