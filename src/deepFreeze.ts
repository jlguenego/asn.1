import {Props} from './interfaces/Props';

export function deepFreeze(obj: Props): Props {
  Object.keys(obj).forEach(prop => {
    if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop]))
      deepFreeze(obj[prop] as Props);
  });
  return Object.freeze(obj);
}
