import assert from 'assert';

import {TypeReference} from '../src/analysis/ASN1Lexer';

describe('Regex Test', () => {
  it('TypeReference', () => {
    const r = TypeReference.PATTERN as RegExp;
    assert('A-W'.match(r));
    assert('A--W'.match(r)?.[0] === 'A');
    assert('asdf'.match(r) === null);
  });
});
