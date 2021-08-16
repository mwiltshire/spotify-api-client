import { isEmpty } from '../isEmpty';

describe('isEmpty', () => {
  it('returns true if value is empty object', () => {
    expect(isEmpty({})).toBe(true);
  });

  it('returns true if value is empty array', () => {
    expect(isEmpty([])).toBe(true);
  });

  it('returns true if value is undefined', () => {
    expect(isEmpty(undefined)).toBe(true);
  });

  it('returns true if value is NaN', () => {
    expect(isEmpty(NaN)).toBe(true);
  });

  it('returns true if value is empty stirng', () => {
    expect(isEmpty('')).toBe(true);
  });

  it('returns false if object is not empty', () => {
    expect(isEmpty({ foo: 'bar' })).toBe(false);
    expect(isEmpty(1)).toBe(false);
    expect(isEmpty('test')).toBe(false);
    expect(isEmpty([{ foo: 'bar' }])).toBe(false);
  });
});
