import type { FieldCore, FormController, KeyOf, Validation } from '../types.ts';
import { createField } from '../field.ts';
import * as v from 'valibot';


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

export type ValibotRegistry<TSchema extends v.ObjectSchema<any, any>> =
	<K extends KeyOf<v.InferInput<TSchema>>>(name: K, abortEarly?: boolean) => FieldCore<v.InferInput<TSchema>[K], K>

/**
 * Wrap registry to replace default validation function with valibot schema
 *
 * It's only check for errors, no transformation will be passed to value
 *
 * By default, registry only check for first error (abortEarly),
 * but you can change this by setting abortEarly in creator or function to false
 * Function will inherit abortEarly from creator
 *
 * @example
 * const Schema = v.object({
 * 	a: v.pipe(v.string('Field required'), v.minLength(1, 'Field required'));
 * })
 * const form = createForm<v.InferInput<typeof Schema>>({ a: 'string' });
 *
 * const vegister = createValibotRegistry(form, Schema);
 *
 *
 * vegister('a');
 * // Same as
 * createField({ of: [form, 'a'], validate: (it) => !it || typeof it != 'string' })
 */
export function createValibotRegistry<TSchema extends v.ObjectSchema<any, any>>(
	form: FormController<v.InferInput<TSchema>>,
	schema: TSchema,
	willAbortEarly = true,
): ValibotRegistry<TSchema> {
	return <K extends KeyOf<v.InferInput<TSchema>>>(name: K, abortEarly = willAbortEarly) => {
		return createField({
			of: [form, name],
			validate(it) {
				const parse = v.safeParse(schema.entries[name], it, { abortEarly });
				if (parse.success) return;
				return parse.issues.map((it) => it.message);
			},
		});
	};
}
