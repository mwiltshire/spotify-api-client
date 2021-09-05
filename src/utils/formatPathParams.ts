export interface FormatConfig {
  url: string;
  parameters: Record<string, string | number>;
  regex?: RegExp;
  strictParameterMatching?: boolean;
}

export function formatPathParams({
  url,
  parameters,
  regex = /{([^}]+)}/g,
  strictParameterMatching = true
}: FormatConfig): string {
  if (!regex.test(url)) {
    throw new Error(
      `Search using ${regex} returned no matches in string "${url}".`
    );
  }

  return url.replace(regex, (...args) => {
    const [$0, $1] = args;
    let match: string;
    // The first argument passed to the replace function will be the
    // full match, then the match groups if any, then the offset etc.
    // If the second argument is a number, then we've hit the offset,
    // meaning no match groups were found. We use the full match then
    // in that case.
    if (typeof $1 === 'number') {
      match = $0;
    } else {
      match = $1;
    }

    const parameter = parameters?.[match];

    if (typeof parameter === 'undefined') {
      if (strictParameterMatching) {
        throw new Error(
          `Tried to replace parameter '${$0}' but could not find property '${match}' in: \n\n${JSON.stringify(
            parameters,
            null,
            2
          )}`
        );
      }
      return $0;
    }
    return String(parameter);
  });
}
