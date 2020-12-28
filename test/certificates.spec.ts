import assert from 'assert';
import {readFileSync} from 'fs';
import {resolve} from 'path';
import {ASN1} from '../src';

describe('RFC3727 Unit Test', () => {
  it('should tokenize', () => {
    const input = readFileSync(
      resolve(__dirname, 'data/certificates/rfc3727.asn1'),
      {
        encoding: 'utf8',
      }
    );

    const module = ASN1.getModuleFromStr(input);
    assert.strictEqual(module.name, 'ComponentMatching');
  });
});
