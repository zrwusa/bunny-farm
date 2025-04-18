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
