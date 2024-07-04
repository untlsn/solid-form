import type { AnyObjectSchema, FieldCore, FormController, KeyOf, Validation } from '../types.ts';
import { createField } from '../field.ts';
import * as v from 'valibot';


export type Registry<T extends object> =  {
	<K extends KeyOf<T>>(name: K, validate?: Validation<T[K]>): FieldCore<T[K], K>,
	__keys__: T,
};
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
	return (<K extends KeyOf<T>>(name: K, validate?: Validation<T[K]>) => createField({
		form, name, validate,
	})) as Registry<T>;
}

type GenericRegistry = {
	(name: any, validate?: Validation<any>): FieldCore<any, any>,
	__keys__: Record<string, any>,
};

type ValibotRegister<T extends GenericRegistry> =
	<K extends KeyOf<T['__keys__']>>(name: K, abortEarly?: boolean) => FieldCore<T['__keys__'][K], K>;

export function valibotValidation<TSchema extends AnyObjectSchema, TRegistry extends GenericRegistry>(
	registry: TRegistry,
	schema: TSchema,
	willAbortEarly = true,
): ValibotRegister<TRegistry> {
	return (name: string, abortEarly = willAbortEarly) => {
		return registry(name, (value) => {
			const parse = v.safeParse(schema.entries[name], value, { abortEarly });
			if (parse.success) return;
			return parse.issues.map((it) => it.message);
		});
	};
}
