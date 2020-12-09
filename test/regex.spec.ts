import assert from 'assert';

import {NumberToken, TypeReference} from '../src/analysis/ASN1Lexer';

describe('Regex Test', () => {
  it('TypeReference', () => {
    const r = TypeReference.PATTERN as RegExp;
    assert('A-W'.match(r));
    assert('A--W'.match(r)?.[0] === 'A');
    assert('asdf'.match(r) === null);
  });
  it('NumberToken', () => {
    const r = NumberToken.PATTERN as RegExp;
    assert('123'.match(r));
    assert('0'.match(r));
    assert('asdf'.match(r) === null);
  });
});
