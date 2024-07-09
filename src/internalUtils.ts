import type { Validation } from './types';
import { asArray } from '@un-tlsn/utils';

export function safeStringParse(value: unknown): string {
	return value == undefined || typeof value == 'object' ? '' : String(value);
}

export function validateValue<T>(value: T, validate: Validation<T>) {
	const newErrors = asArray(validate?.(value)).filter((it: unknown) => typeof it == 'string');
	return newErrors.length ? newErrors : undefined;
}
