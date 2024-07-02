import type { FieldCore, FormController, KeyOf, Validation } from '../types.ts';
import { createField } from '../createField.ts';
import * as v from 'valibot';
import { BaseIssue } from 'valibot';


export type Registry<T extends object> =  <K extends KeyOf<T>>(name: K, validate?: Validation<T[K]>) => FieldCore<T[K], K>
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
	return <K extends KeyOf<T>>(name: K, validate?: Validation<T[K]>) => createField({
		of: [form, name],
		validate,
	});
}

export type ValibotRegistry<T extends object> =
	<K extends KeyOf<T>>(name: K, schema: v.BaseSchema<T[K], any, BaseIssue<any>>, abortEarly?: boolean) => FieldCore<T[K], K>

/**
 * Wrap registry to replace default validation function with valibot schema
 *
 * It's only check for errors, not transformation will be passed to value
 *
 * By default, registry only check for first error (abortEarly),
 * but you can change this by setting abortEarly in creator or function to false
 * Function will inherit abortEarly from creator
 *
 * @example
 * const form = createForm({ a: 'string' });
 *
 * const vegister = createValibotRegistry(createRegistry(form));
 * const Schema = v.pipe(v.string('Field required'), v.minLength(1, 'Field required'));
 *
 * vegister('a', Schema);
 * // Same as
 * createField({ of: [form, 'a'], validate: (it) => !it || typeof it != 'string' })
 */
export function createValibotRegistry<T extends object>(register: Registry<T>, willAbortEarly = true) {
	return <K extends KeyOf<T>>(name: K, schema: v.BaseSchema<T[K], any, BaseIssue<any>>, abortEarly = willAbortEarly) => {
		register(name, (it) => {
			const parse = v.safeParse(schema, it, { abortEarly });
			if (parse.success) return;
			return parse.issues.map((it) => it.message);
		});
	};
}
