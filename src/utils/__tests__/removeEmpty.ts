import { removeEmpty } from '../removeEmpty';

describe('removeEmpty', () => {
  it('returns object with all null, undefined or empty object values removed recursively', () => {
    const obj = {
      foo: 'bar',
      bar: null,
      baz: undefined,
      bam: {
        foo: 'bar',
        bar: null,
        baz: {
          bam: {}
        },
        bam: {},
        boo: [
          {
            foo: 1
          },
          {
            foo: 1,
            bar: undefined,
            baz: []
          },
          {},
          [],
          1
        ]
      }
    };

    expect(removeEmpty(obj)).toStrictEqual({
      foo: 'bar',
      bam: {
        foo: 'bar',
        boo: [{ foo: 1 }, { foo: 1 }, 1]
      }
    });
  });
});
