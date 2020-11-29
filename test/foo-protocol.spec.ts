import assert from 'assert';

import {asn1Parse} from '../src';

describe('Base64 Unit Test', () => {
  it('should parse the foo protocol', () => {
    const output = asn1Parse();
    assert.deepStrictEqual(output, {});
  });
});
