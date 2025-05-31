/**
 * Generate a unique 64-bit string type ID
 * @param size
 */
export function generateUuNumId(size = 18): string {
  const alphabet = '0123456789';
  let id = '';
  let i = size;
  while (i--) {
    id += alphabet[(Math.random() * alphabet.length) | 0];
  }
  return id;
}

export function isUpperSnakeCase(str: string): boolean {
  const regex = /^[A-Z]+(_[A-Z]+)*$/;
  return regex.test(str);
}

export function isCamelCase(str: string): boolean {
  const regex = /^[a-z]+([A-Z][a-z]*)*$/;
  return regex.test(str);
}

export function isSnakeCase(str: string): boolean {
  const regex = /^[a-z]+(_[a-z]+)*$/;
  return regex.test(str);
}

export function isPascalCase(str: string): boolean {
  const regex = /^[A-Z][a-z]*([A-Z][a-z]*)*$/;
  return regex.test(str);
}

export const addLeadingSlash = (path?: string): string =>
    path && typeof path === 'string'
        ? path.charAt(0) !== '/' && path.substring(0, 2) !== '{/'
            ? '/' + path
            : path
        : '';

export const normalizePath = (path?: string): string =>
    path
        ? path.startsWith('/')
            ? ('/' + path.replace(/\/+$/, '')).replace(/\/+/g, '/')
            : '/' + path.replace(/\/+$/, '')
        : '/';

export const stripEndSlash = (path: string) =>
    path[path.length - 1] === '/' ? path.slice(0, path.length - 1) : path;

export const isString = (val: any): val is string => typeof val === 'string';
