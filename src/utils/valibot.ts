import type { AnyObjectSchema, FieldCore, FormController, SubmitHandler, Validation } from '../types';
import * as v from 'valibot';
import type { KeyOf } from '../types.ts';
import formPrevent from './formPrevent.ts';
import triggerValidation from './triggerValidation.ts';
import { unwrap } from 'solid-js/store';

/**
 * Wrap valibot schema to fit solid-form validation function
 */
export function parseValibot<T>(
	schema: v.BaseSchema<T, unknown, v.BaseIssue<unknown>>,
	config: { abortEarly?: boolean, loose: true },
): Validation<any>;
export function parseValibot<T>(
	schema: v.BaseSchema<T, unknown, v.BaseIssue<unknown>>,
	config?: { abortEarly?: boolean, loose?: false },
): Validation<T>;
export function parseValibot<T>(
	schema: v.BaseSchema<T, unknown, v.BaseIssue<unknown>>,
	config?: { abortEarly?: boolean, loose?: boolean },
): Validation<T> {
	return (value) => {
		const parse = v.safeParse(schema, value, { abortEarly: config?.abortEarly });
		if (parse.success) return;
		return parse.issues.map((v) => v.message);
	};
}

export type GenericRegistry = {
	(name: any, validate?: Validation<any>): FieldCore<any, any>,
	__keys__: Record<string, any>,
};

export type ValibotRegister<T extends GenericRegistry> =
	<K extends KeyOf<T['__keys__']>>(name: K, abortEarly?: boolean) => FieldCore<T['__keys__'][K], K>;

/**
 * Wrap entire registration to replace default validation with valibot validation of object
 */
export function valibotValidation<TSchema extends AnyObjectSchema, TRegistry extends GenericRegistry>(
	registry: TRegistry,
	schema: TSchema,
	willAbortEarly = true,
): ValibotRegister<TRegistry> {
	return (name: string, abortEarly = willAbortEarly) => {
		return registry(name, parseValibot(schema, { abortEarly }));
	};
}

/**
 * Work like createHandleSubmit, but additionally validate values by valibot schema
 *
 * If raw is set to true, handler will ignore default validation from fields
 */
export function createValibotSubmit<TSchema extends v.BaseSchema<object, any, v.BaseIssue<any>>>(
	form: FormController<object>,
	schema: TSchema,
	onSubmit: (values: v.InferOutput<TSchema>) => void,
	raw?: boolean,
): SubmitHandler {
	return (ev) => {
		if (ev) formPrevent(ev);
		form.submitted = true;
		if (!raw && !triggerValidation(form)) return;
		const parse = v.safeParse(schema, unwrap(form.values));
		if (parse.success) onSubmit(parse.output);

		const nested = !parse.success && v.flatten(parse.issues).nested || {};
		form._fields.forEach((field) => {
			field.setErrors(nested[field.name]);
		});
	};
}
