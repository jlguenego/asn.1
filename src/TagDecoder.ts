import {TagClass} from './interfaces/TagClass';
import {TagUniversal} from './interfaces/TagUniversal';

export class TagDecoder {
  static getLabel(tagClass: TagClass, tag: number): string {
    if (tagClass === TagClass.UNIVERSAL) {
      const foundTag = Object.values(TagUniversal).find(t => t.code === tag);
      if (!foundTag) {
        throw new Error('tag not yet implemented');
      }
      return foundTag.label;
    }
    return '' + tag;
  }
}
