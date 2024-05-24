import type { Validation } from '~/types.ts';
import { asArray } from '~/internalUtils.ts';

function onlyString(value: unknown) {
	return typeof value == 'string';
}

export default function triggerFieldValidation(value: any, validate: Validation<any>) {
	const newErrors = asArray(validate?.(value)).filter(onlyString) as string[];
	return newErrors.length ? newErrors : undefined;
}
