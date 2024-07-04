import type { AnyObjectSchema, FieldCore, FormController, Path, PathValue, Validation } from '../types.ts';
import { createPathField } from '../pathField.ts';
import * as v from 'valibot';
import { valibotValidation } from '../internalUtils.ts';

export type PathRegistry<T extends object> =  <K extends Path<T>>(name: K, validate?: Validation<PathValue<T, K>>) => FieldCore<PathValue<T, K>, K>;
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
	return <K extends Path<T>>(name: K, validate?: Validation<PathValue<T, K>>) => createPathField({
		of: [form, name],
		validate,
	});
}


export type ValibotPathRegistry<TSchema extends v.ObjectSchema<any, any>> =
	<K extends Path<v.InferInput<TSchema>>>(name: K, abortEarly?: boolean) => FieldCore<PathValue<v.InferInput<TSchema>, K>, K>;

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
 * 	deep: v.object({
 * 	  a: v.pipe(v.string('Field required'), v.minLength(1, 'Field required')),
 * 	})
 * })
 * const form = createForm<v.InferInput<typeof Schema>>({ deep: { a: 'string' } });
 *
 * const register = createValibotPathRegistry(form, Schema);
 *
 *
 * register('deep.a');
 * // Same as
 * createPathField({ of: [form, 'deep.a'], validate: (it) => !it || typeof it != 'string' })
 */
export function createValibotPathRegistry<TSchema extends AnyObjectSchema>(
	form: FormController<Partial<v.InferInput<TSchema>>>,
	schema: TSchema,
	willAbortEarly = true,
): ValibotPathRegistry<TSchema> {
	return (name, abortEarly = willAbortEarly) => {
		return createPathField({
			of:       [form, name],
			validate: valibotValidation(schema, name, abortEarly),
		});
	};
}
