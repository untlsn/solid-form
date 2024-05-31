import type { FormController } from '~/types.ts';
import { unwrap } from 'solid-js/store';

/** @deprecated just use arrow function or createHandleSubmit */
export default function createPredefinedGetter<T extends object, R>(formStore: FormController<T>, cb: (value: T) => R) {
	return () => cb(unwrap(formStore.values) as any);
}
