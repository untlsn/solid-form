import { AnyObjectSchema, EmptyValidation, MaybeAccessor, Validation } from './types';
import type { Accessor } from 'solid-js';
import * as v from 'valibot';

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

function onlyString(value: unknown) {
	return typeof value == 'string';
}

export function validateValue<T>(value: T, validate: Validation<T>) {
	const newErrors = asArray(validate?.(value)).filter(onlyString) as string[];
	return newErrors.length ? newErrors : undefined;
}

export function isEmptyValidation(validation: Validation<unknown>): validation is EmptyValidation {
	return validation?.empty == true;
}

export function _valibotValidation<T extends AnyObjectSchema>(schema: T, name: keyof T['entries'], abortEarly?: boolean): Validation<unknown> {
	return (value) => {
		const parse = v.safeParse(schema.entries[name], value, { abortEarly });
		if (parse.success) return;
		return parse.issues.map((it) => it.message);
	};
}
