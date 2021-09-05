import { formatPathParams } from '../formatPathParams';

describe('formatPathParams', () => {
  test('outermost match group is used if provided', () => {
    const formatted = formatPathParams({
      url: 'https://www.example.com/projects/{projectId}/todo/{todoId}',
      parameters: { projectId: 1234, todoId: '5678' },
      regex: /{([^}]+)}/g,
      strictParameterMatching: false
    });
    expect(formatted).toBe('https://www.example.com/projects/1234/todo/5678');
  });

  test('custom regex can be passed', () => {
    const formatted = formatPathParams({
      url: 'https://www.example.com/projects/:projectId/todo/:todoId',
      parameters: { projectId: 1234, todoId: '5678' },
      regex: /:([^\/]+)|$/g,
      strictParameterMatching: false
    });
    expect(formatted).toBe('https://www.example.com/projects/1234/todo/5678');
  });

  test('raw match is used if no outer match group is provided', () => {
    const formatted = formatPathParams({
      url: 'https://www.example.com/projects/projectId/todo/todoId',
      parameters: { projectId: 1234, todoId: '5678' },
      regex: /projectId|todoId/g,
      strictParameterMatching: false
    });
    expect(formatted).toBe('https://www.example.com/projects/1234/todo/5678');
  });

  test('multiple instances of same path parameter name in url are formatted', () => {
    const formatted = formatPathParams({
      url: 'https://www.example.com/projects/{uid}/todo/{uid}',
      parameters: { uid: 1234 },
      regex: /{([^}]+)}/g,
      strictParameterMatching: false
    });
    expect(formatted).toBe('https://www.example.com/projects/1234/todo/1234');
  });

  it('throws error if no matches are found using regex pattern', () => {
    const url = 'https://www.example.com/projects/{projectId}/todo/{todoId}';
    const pathParams = { projectId: 1234, todoId: '5678' };
    const regex = /<[^>]+>/g;
    expect(() =>
      formatPathParams({
        url,
        parameters: pathParams,
        regex,
        strictParameterMatching: false
      })
    ).toThrowError(
      'Search using /<[^>]+>/g returned no matches in string "https://www.example.com/projects/{projectId}/todo/{todoId}".'
    );
  });

  it('throws error if found match is missing in path parameters object', () => {
    const url = 'https://www.example.com/projects/{projectId}/todo/{todoId}';
    const pathParams = { projectId: 1234 };
    const regex = /{([^}]+)}/g;
    expect(() =>
      formatPathParams({
        url,
        parameters: pathParams,
        regex,
        strictParameterMatching: true
      })
    ).toThrowError(
      /Tried to replace parameter '{todoId}' but could not find property 'todoId' in*/
    );
  });

  it('throws error if pathParams parameter is undefined', () => {
    const url = 'https://www.example.com/projects/{projectId}/todo/{todoId}';
    const regex = /{([^}]+)}/g;
    expect(() =>
      formatPathParams({
        url,
        parameters: undefined as any,
        regex,
        strictParameterMatching: true
      })
    ).toThrowError(
      /Tried to replace parameter '{projectId}' but could not find property 'projectId' in*/
    );
  });

  it('replaces parameter if possible, otherwise returns raw parameter', () => {
    const url = 'https://www.example.com/projects/{projectId}/todo/{todoId}';
    const pathParams = { projectId: 1234 };
    const regex = /{([^}]+)}/g;
    expect(
      formatPathParams({
        url,
        parameters: pathParams,
        regex,
        strictParameterMatching: false
      })
    ).toBe('https://www.example.com/projects/1234/todo/{todoId}');
  });
});
