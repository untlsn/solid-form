import type { FormController } from '~/types.ts';
import { createEffect } from 'solid-js';

type ObjectSetter<T extends object> = { [K in keyof T]?: (oldValue: T[K]) => T[K] | undefined };

/**
 * Allow to set values of store in more readable way
 * @param form - form controller
 * @param values - object with setter as values
 *
 * @example
 * const form = createForm({ a: 5, b: 'string', c: false });
 *
 * createSetter(form, {
 *   a() {
 *     return props.a;
 *   }
 *   b() {
 *     return location.pathname
 *   }
 *   c(oldValue) {
 *     if (!props.open) return false
 *     return oldValue;
 *   }
 * })
 */
export default function createSetter<T extends object>(form: FormController<T>, values: ObjectSetter<T>) {
	Object.entries(values).forEach(([key, setter]) => {
		createEffect(() => {
			(form.setValues as any)(key, setter);
		});
	});
}
