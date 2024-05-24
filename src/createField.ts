import type { FormController, KeyOf, Validation, FieldCore } from './types';
import { createFieldCore } from './createFieldCore';


export type LiteField<T extends object = object, K extends KeyOf<T> = any> = FieldCore<T[K], K>

export type LiteFieldOptions<T extends object, K extends KeyOf<T>> = {
	/* tuple of formState and name. Typescript work better when both props are in tuple */
	of:        [formState: FormController<T>, name: K],
	/**
	 * Maybe array of functions that return one or more errors. Falsy values will be ignored
	 */
	validate?: Validation<Partial<T>[K]>
}

export function createField<T extends object, K extends KeyOf<T>>(options: LiteFieldOptions<T, K>): LiteField<T, K> {
	return createFieldCore({
		value() {
			return options.of[0].values[options.of[1]];
		},
		setValue(newValue) {
			options.of[0].setValues(options.of[1], newValue as T[K]);
		},
		fieldList: options.of[0]._fields,

		submitted() {
			return options.of[0].submitted;
		},
		name:     options.of[1],
		validate: options.validate,
	});
}
