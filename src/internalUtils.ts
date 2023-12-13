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

export function filterFalsy<T>(arr: (T | undefined | null | false | 0 | '')[]) {
	return arr.filter(Boolean) as T[];
}

// Check if value is undefined and if value is array check if its not empty
export function isMaybeArrayEmpty<T>(value: T | T[]) {
	if (!value) return true;
	if (Array.isArray(value)) return !value.length;
	return false;
}
