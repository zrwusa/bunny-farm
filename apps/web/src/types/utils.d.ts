

export type ArrayElement<T> = T extends (infer E)[] ? E : never;

export type FunctionArgs<T> = T extends (...args: infer E) => unknown ? E : never;
