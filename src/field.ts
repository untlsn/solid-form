import type { FieldCore, FormController, KeyOf, Validation } from './types';
import { createFieldCore } from './fieldCore.ts';

export type FieldOptions<T extends object, K extends KeyOf<T>> = {
	form:      FormController<T>,
	name:      K
	validate?: Validation<T[K]>
};

/**
 * Default wrapper over createFieldCore
 * Should be used in 90% of cases
 * Accept primitive and object values
 * For deep values use createPathField and for other advanced cases use createFieldCore
 *
 * @param options options object with of tuple for value assignment and optional validate function
 *
 * @example
 * const form = createForm({ value: 5, deepValue: { a: 1, b: 2, c: 'string' } })
 *
 * createField({ of: [form, 'value'], validate: (it) => it < 0 && 'value cannot be negative'})
 * createField({ of: [form, 'deepValue'], validate: (it) => it.a == it.b && 'deepValue a and b must be identical' })
 */
export function createField<T extends object, K extends KeyOf<T>>({ form, validate, name }: FieldOptions<T, K>): FieldCore<T[K], K> {
	return createFieldCore({
		value: () => form.values[name],
		setValue(newValue) {
			form.values[name] = newValue;
		},
		fieldList: form._fields,
		submitted: () => form.submitted,
		name,
		validate,
	});
}
