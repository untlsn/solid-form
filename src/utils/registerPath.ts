import type { FieldCore, FormController, Path, PathValue, Validation } from '../types.ts';
import { createPathField } from '../pathField.ts';

type PathRegistryKeys<T extends object> = {
	[K in Path<T>]: PathValue<T, K>
};
export type PathRegistry<T extends object> = {
	<K extends Path<T>>(name: K, validate?: Validation<PathValue<T, K>>): FieldCore<PathValue<T, K>, K>,
	__keys__: PathRegistryKeys<T>,
};
/**
 * Shortcut for createPathField that predefine form controller
 * @param form - form controller
 *
 * @returns function with required path and optional validate
 * @example
 * const form = createForm({ deep: { a: 'string' } });
 *
 * const register = createPathRegistry(form);
 *
 * register('deep.a', (it) => !it && 'Field required');
 * // Same as
 * createPathField({ of: [form, 'deep.a'], validate: (it) => !it && 'Field required' })
 */
export function createPathRegistry<T extends object>(
	form: FormController<T>,
): PathRegistry<T> {
	return (<K extends Path<T>>(name: K, validate?: Validation<PathValue<T, K>>) => createPathField({
		form, name, validate,
	})) as PathRegistry<T>;
}
