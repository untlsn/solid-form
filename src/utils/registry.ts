import type { FieldCore, FormController, KeyOf, Validation } from '../types.ts';
import { createField } from '../field.ts';


export type Registry<T extends object> =  {
	<K extends KeyOf<T>>(name: K, validate?: Validation<T[K]>): FieldCore<T[K], K>,
	__keys__: T,
};
/**
 * Shortcut for createField that predefine form controller
 * @param form - form controller
 *
 * @returns function with required key and optional validate
 * @example
 * const form = createForm({ a: 'string' });
 *
 * const register = createRegistry(form);
 *
 * register('a', (it) => !it && 'Field required');
 * // Same as
 * createField({ of: [form, 'a'], validate: (it) => !it && 'Field required' })
 */
export function createRegistry<T extends object>(form: FormController<T>): Registry<T> {
	return (<K extends KeyOf<T>>(name: K, validate?: Validation<T[K]>) => createField({
		form, name, validate,
	})) as Registry<T>;
}
