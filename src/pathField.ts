import type { FieldCore, FormController, Path, PathValue, Validation } from './types.ts';
import { createFieldCore } from './fieldCore.ts';

/**
 * Options for PathField. Looks similar to FieldOptions but name is not key of from, but path
 */
export type PathFieldOptions<T extends object, K extends Path<T>> = {
	form:      FormController<T>,
	name:      K
	validate?: Validation<PathValue<T, K>>
};

/**
 * Wrapper over createFieldCore that allow to use path string instead of shallow key
 * Should be used in rare scenarios, where you need deep fields
 * Accept primitive and object values
 * For shallow values use createField and for advanced cases use createFieldCore
 *
 * @param options options object with of tuple for value assignment and optional validate function
 *
 * @example
 * const form = createForm({ value: 5, deepValue: { a: 1, b: 2, c: 'string' } })
 *
 * createField({ of: [form, 'deepValue.a'], validate: (it) => !it 'deepValue.a cannot be 0' })
 */
export function createPathField<T extends object, K extends Path<T>>({ name, form, validate }: PathFieldOptions<T, K>): FieldCore<PathValue<T, K>, K> {
	return createFieldCore({
		value: () => name.split('.').reduce((acc, cur) => acc?.[cur], form.values as any),
		setValue(newValue) {
			const keys = name.split('.');
			const last = keys.pop()!;
			keys.reduce((acc, cur) => {
				acc[cur] ??= {};
				return acc[cur];
			}, form.values as any)[last] = newValue;
		},
		fieldList: form._fields,
		submitted: () => form.submitted,
		name,
		validate,
	});
}
