import { stringifyEntries } from '../stringifyEntries';

describe('stringifyEntries', () => {
  it('converts all entry key-value pairs to the string type', () => {
    const entries = [
      ['foo', 123],
      [1, 'baz'],
      [123, true]
    ];
    expect(stringifyEntries(entries)).toEqual([
      ['foo', '123'],
      ['1', 'baz'],
      ['123', 'true']
    ]);
  });

  it('joins array value types with comma by default', () => {
    const entries = [
      ['foo', 123],
      [1, 'baz'],
      [123, ['foo', 'bar', 'baz']]
    ];
    expect(stringifyEntries(entries)).toEqual([
      ['foo', '123'],
      ['1', 'baz'],
      ['123', 'foo,bar,baz']
    ]);
  });

  it('takes a second argument for join array value types', () => {
    const entries = [
      ['foo', 123],
      [1, 'baz'],
      [123, ['foo', 'bar', 'baz']]
    ];
    expect(stringifyEntries(entries, (a) => a.join(' '))).toEqual([
      ['foo', '123'],
      ['1', 'baz'],
      ['123', 'foo bar baz']
    ]);
  });
});
