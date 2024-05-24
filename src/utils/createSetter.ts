import type { FormController } from '~/types.ts';
import { createEffect } from 'solid-js';

type ObjectSetter<T extends object> = { [K in keyof T]?: (oldValue: T[K]) => T[K] | undefined };

export default function createSetter<T extends object>(formStore: FormController<T>, values: ObjectSetter<T>) {
	Object.entries(values).forEach(([key, setter]) => {
		createEffect(() => {
			(formStore.setValues as any)(key, setter);
		});
	});
}
