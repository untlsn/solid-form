type FieldValue = string | string[] | number | boolean | File | File[] | Date | undefined | null;
type TupleKeys<T extends Array<any>> = Exclude<keyof T, keyof any[]>;
type IsTuple<T extends Array<any>> = number extends T['length'] ? false : true;
type ValuePath<K extends string | number, T> = T extends string[] ? FoldValuePath<K, T> : T extends FieldValue | Blob ? `${K}` : `${K}.${ValuePaths<T>}`;
type FoldValuePath<K extends string | number, T> = `${K}` | `${K}.${ValuePaths<T>}`;

// Covert object to end path string
export type ValuePaths<T> = T extends Array<infer TChild> ? IsTuple<T> extends true ? {
	[TKey in TupleKeys<T>]-?: ValuePath<TKey & string, T[TKey]>;
}[TupleKeys<T>] : ValuePath<number, TChild> : {
	[TKey in keyof T]-?: ValuePath<TKey & string, T[TKey]>;
}[keyof T];

export type MaybeArray<T> = T | T[];

export type FieldValues = {
	[name: string]: MaybeArray<FieldValue | FieldValues>
}

export type FoldValuePaths<T> = T extends Array<infer TChild> ? IsTuple<T> extends true ? {
	[TKey in TupleKeys<T>]-?: FoldValuePath<TKey & string, T[TKey]>;
}[TupleKeys<T>] : FoldValuePath<number, TChild> : {
	[TKey in keyof T]-?: FoldValuePath<TKey & string, T[TKey]>;
}[keyof T];

type ArrayPath<K extends string | number, T> = T extends Array<any> ? `${K}` | `${K}.${ArrayPaths<T>}` : T extends FieldValues ? `${K}.${ArrayPaths<T>}` : never;
type ArrayPaths<TValue> = TValue extends Array<infer TChild> ? IsTuple<TValue> extends true ? {
	[TKey in TupleKeys<TValue>]-?: ArrayPath<TKey & string, TValue[TKey]>;
}[TupleKeys<TValue>] : ArrayPath<number, TChild> : {
	[TKey in keyof TValue]-?: ArrayPath<TKey & string, TValue[TKey]>;
}[keyof TValue];


export type PathValue<TValue, TPath> = TPath extends `${infer TKey1}.${infer TKey2}` ? TKey1 extends keyof TValue ? TKey2 extends ValuePaths<TValue[TKey1]> | ArrayPaths<TValue[TKey1]> ? PathValue<TValue[TKey1], TKey2> : never : TKey1 extends `${number}` ? TValue extends Array<infer TChild> ? PathValue<TChild, TKey2 & (ValuePaths<TChild> | ArrayPaths<TChild>)> : never : never : TPath extends keyof TValue ? TValue[TPath] : never;
