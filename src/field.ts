import type { FormController, KeyOf, Validation, FieldCore } from './types';
import { createFieldCore } from './fieldCore.ts';

export type LiteFieldOptions<T extends object, K extends KeyOf<T>> = {
	of:        [formState: FormController<T>, name: K],
	validate?: Validation<T[K]>
}

/**
 * Default wrapper over createFieldCore
 * Should be used in 90% of cases
 * Accept primitive and object values
 * For deep values and other advanced cases use createFieldCore
 *
 * @param options options object with of tuple for value assignment and optional validate function
 *
 * @example
 * const form = createForm({ value: 5, deepValue: { a: 1, b: 2, c: 'string' } })
 *
 * createField({ of: [form, 'value'], validate: (it) => it < 0 && 'value cannot be negative'})
 * createField({ of: [form, 'deepValue'], validate: (it) => it.a == it.b && 'deepValue a and b must be identical' })
 */
export function createField<T extends object, K extends KeyOf<T>>(options: LiteFieldOptions<T, K>): FieldCore<T[K], K> {
	return createFieldCore({
		value() {
			return options.of[0].values[options.of[1]];
		},
		setValue(newValue) {
			options.of[0].values[options.of[1]] = newValue;
		},
		fieldList: options.of[0]._fields,

		submitted() {
			return options.of[0].submitted;
		},
		name:     options.of[1],
		validate: options.validate,
	});
}
