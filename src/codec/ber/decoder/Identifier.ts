import {TagClass} from '../../../interfaces/TagClass';
import {TagUniversal} from '../../../interfaces/TagUniversal';

export class Identifier {
  tagClass = TagClass.UNIVERSAL;
  constructed = false;
  tag = 0;

  isComposed() {
    if (this.tagClass !== TagClass.UNIVERSAL) {
      return true;
    }
    if (this.tag === TagUniversal.SEQUENCE) {
      return true;
    }
    return false;
  }
}
