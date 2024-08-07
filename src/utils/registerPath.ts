import type { FieldCore, FormController, Path, PathValue, Validation } from '../types.ts';
import { createPathField } from '../pathField.ts';


export type PathRegistry<T extends object> = <K extends Path<T>>(name: K, validate?: Validation<PathValue<T, K>>) => FieldCore<PathValue<T, K>, K>;
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
	return (name, validate) => createPathField({
		form, name, validate,
	});
}
