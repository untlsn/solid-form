import type { Validation } from './types';
import { asArray } from '@untlsn/utils';

export function safeStringParse(value: unknown): string {
	return value == undefined || typeof value == 'object' ? '' : String(value);
}

export function validateValue<T>(value: T, validate: Validation<T>) {
	let dirtyErrors: any;
	try {
		dirtyErrors = validate?.(value);
	} catch (err) {
		dirtyErrors = err;
	}

	const newErrors = asArray(dirtyErrors)
		.map((it: unknown) => it && typeof it == 'object' && 'message' in it ? it.message : it)
		.filter((it: unknown) => typeof it == 'string');
	return newErrors.length ? newErrors : undefined;
}

export function willThrow(cb?: () => void): boolean {
	try {
		cb?.();
		return false;
	} catch {
		return true;
	}
}
