export function isPlainObject(obj: any): obj is Record<string, any> {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
