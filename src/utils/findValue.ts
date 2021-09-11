import { isPlainObject } from './isPlainObject';

export function findValue<T = any>(
  obj: Record<string, any>,
  key: string
): T | undefined {
  let result;

  if (obj[key]) {
    return obj[key];
  }

  for (const k in obj) {
    if (k === key) {
      return obj[k];
    }

    if (isPlainObject(obj[k])) {
      result = findValue(obj[k], key);
    }
  }

  return result;
}
