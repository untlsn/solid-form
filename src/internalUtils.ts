import { Accessor } from 'solid-js';
import { MaybeArray } from './types';

export type MaybeAccessor<T> = T | Accessor<T>

export function unwrapAccessor<T>(value: MaybeAccessor<T>): T {
	if (typeof value == 'function') return (value as any)();
	return value;
}

export function asArray<T>(value: MaybeArray<T>) {
	if (Array.isArray(value)) return value;
	return [value];
}
