import type { FieldCore, FormController, Path, PathValue, Validation } from './types.ts';
import { createFieldCore } from './fieldCore.ts';

export type PathFieldOptions<T extends object, K extends Path<T>> = {
	of:        [formState: FormController<T>, name: K],
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
export function createPathField<T extends object, K extends Path<T>>(options: PathFieldOptions<T, K>): FieldCore<PathValue<T, K>, K> {
	return createFieldCore({
		value() {
			return options.of[1].split('.').reduce((acc, cur) => acc[cur], options.of[0].values as any);
		},
		setValue(newValue) {
			const keys = options.of[1].split('.');
			const last = keys.pop()!;
			keys.reduce((acc, cur) => acc[cur], options.of[0].values as any)[last] = newValue;
		},
		fieldList: options.of[0]._fields,

		submitted() {
			return options.of[0].submitted;
		},
		name:     options.of[1],
		validate: options.validate,
	});
}
