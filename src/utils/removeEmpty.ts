import { isPlainObject } from './isPlainObject';
import { isEmpty } from './isEmpty';

export function removeEmpty(value: Record<string, any> | Array<any>): any {
  if (Array.isArray(value)) {
    return value.map(mapArrayValue).filter(filterArrayValue);
  }

  return Object.fromEntries(
    Object.entries(value).map(mapEntry).filter(filterEntry)
  );
}

function mapArrayValue(v: any) {
  if (isPlainObject(v)) {
    return removeEmpty(v);
  }
  return v;
}

function filterArrayValue(v: any) {
  return !isEmpty(v);
}

function mapEntry([k, v]: [string, any]) {
  if (isPlainObject(v) || Array.isArray(v)) {
    return [k, removeEmpty(v)];
  }
  return [k, v];
}

function filterEntry([, v]: Array<any>) {
  return filterArrayValue(v);
}
