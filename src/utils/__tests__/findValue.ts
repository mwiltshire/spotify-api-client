import { findValue } from '../findValue';

describe('findValue', () => {
  it('recursively finds the value of the first instance of a given key in an object', () => {
    const obj = {
      foo: {
        bar: {
          baz: 123,
          bam: 456,
          boop: {
            baz: 999
          }
        }
      }
    };

    expect(findValue(obj, 'baz')).toBe(123);
  });

  it('returns undefined if the key cannot be found', () => {
    const obj = {
      foo: {
        bar: {
          baz: 123
        }
      }
    };

    expect(findValue(obj, 'test')).toBeUndefined();
  });
});
