export function omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  const newObj = { ...obj };

  keys.forEach((key) => {
    delete newObj[key];
  });

  return newObj;
}

// Helper function to resolve the path
export function getNestedValue<T>(obj: Record<string, unknown>, path: string): T | undefined {
  return path.split('.').reduce((prev, curr) => {
    if (prev === null || prev === undefined) return undefined;
    return (prev as Record<string, unknown>)[curr] as T;
  }, obj as unknown) as T | undefined;
}

export const isUndefined = (obj: any): obj is undefined => typeof obj === 'undefined';

export const isObject = (fn: any): fn is object => !isNil(fn) && typeof fn === 'object';

export const isPlainObject = (fn: any): fn is object => {
  if (!isObject(fn)) {
    return false;
  }
  const proto = Object.getPrototypeOf(fn);
  if (proto === null) {
    return true;
  }
  const ctor = Object.prototype.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return (
    typeof ctor === 'function' &&
    ctor instanceof ctor &&
    Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object)
  );
};

export const isNil = (val: any): val is null | undefined => isUndefined(val) || val === null;

export const isFunction = (val: any): val is Function => typeof val === 'function';

export const isConstructor = (val: any): boolean => val === 'constructor';

export const isEmpty = (array: any): boolean => !(array && array.length > 0);

export const isSymbol = (val: any): val is symbol => typeof val === 'symbol';

// Convert object to GraphQL string
export function objToGraphQLString(obj: Record<string, unknown>): string {
  return Object.entries(obj)
    .map(([key, value]) => {
      if (value === undefined || value === null) return '';
      if (typeof value === 'object' && value !== null) {
        return `${key}: {${objToGraphQLString(value as Record<string, unknown>)}}`;
      }
      if (typeof value === 'string') {
        return `${key}: "${value}"`;
      }
      return `${key}: ${value}`;
    })
    .filter(Boolean)
    .join(', ');
}
