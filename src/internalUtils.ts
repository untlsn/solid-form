import type { MaybeAccessor } from './types';
import type { Accessor } from 'solid-js';

export type Falsy = undefined | null | 0 | '' | false;

export function filterFalsy<T>(arr: (T | Falsy)[]) {
	return arr.filter(Boolean) as T[];
}

export function asArray<T>(value: T | T[]) {
	return Array.isArray(value) ? value : [value];
}

export function isMaybeArrayEmpty(value: unknown | unknown[]) {
	if (!value) return true;
	if (Array.isArray(value)) return !value.length;
	return false;
}

export function access<T>(value: MaybeAccessor<T>): T {
	if (typeof value == 'function') return (value as Accessor<T>)();
	return value;
}

/**
 * Convert value to string
 * If value is undefined, null or object convert to empty string
 */
export function safeStringParse(value: unknown): string {
	return value == undefined || typeof value == 'object' ? '' : String(value);
}
