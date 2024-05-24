import type { FormController } from '~/types.ts';
import { unwrap } from 'solid-js/store';

export default function createPredefinedGetter<T extends object, R>(formStore: FormController<T>, cb: (value: T) => R) {
	return () => cb(unwrap(formStore.values) as any);
}
