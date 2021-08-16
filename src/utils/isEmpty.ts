import { isPlainObject } from './isPlainObject';

export function isEmpty(value: any) {
  return (
    typeof value === 'undefined' ||
    value === null ||
    value !== value ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (isPlainObject(value) && Object.keys(value).length === 0)
  );
}
