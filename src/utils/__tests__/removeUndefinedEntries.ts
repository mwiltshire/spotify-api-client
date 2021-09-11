import { removeUndefinedEntries } from '../removeUndefinedEntries';

describe('stringifyEntries', () => {
  it('removes entries with undefined values from entry array', () => {
    const entries = [
      ['foo', 123],
      [1, 'baz'],
      [123, undefined]
    ];
    expect(removeUndefinedEntries(entries)).toEqual([
      ['foo', 123],
      [1, 'baz']
    ]);
  });
});
