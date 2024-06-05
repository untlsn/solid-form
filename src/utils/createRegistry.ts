import type { FormController, KeyOf, Validation } from '../types.ts';
import { createField } from '../createField.ts';

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
export default function createRegistry<T extends object>(form: FormController<T>) {
	return <K extends KeyOf<T>>(name: K, validate?: Validation<Partial<T>[K]>) => createField({
		of: [form, name],
		validate,
	});
}
