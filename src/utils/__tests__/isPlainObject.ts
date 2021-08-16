import { isPlainObject } from '../isPlainObject';

describe('isPlainObject', () => {
  it('returns true if value is a plain object', () => {
    expect(isPlainObject({ foo: 'bar' })).toBe(true);
  });

  it('returns false if value is not a plain object', () => {
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject(1)).toBe(false);
    expect(isPlainObject('')).toBe(false);
    expect(isPlainObject([1, 2, 3])).toBe(false);
    expect(isPlainObject(new Map())).toBe(false);
    expect(isPlainObject(Symbol())).toBe(false);
  });
});
