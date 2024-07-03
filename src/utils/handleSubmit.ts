import type { FormController } from '../types.ts';
import { unwrap } from 'solid-js/store';
import formPrevent from './formPrevent.ts';
import triggerValidation from './triggerValidation.ts';
import * as v from 'valibot';

type SubmitHandler = (ev?: Event) => void

/**
 * Create submitter for form.
 * When executed form.submitted will be toggled to true,
 * all fields validation will be triggered and if validation is successful onSubmit argument will be executed
 *
 * @param form - form controller
 * @param onSubmit - function that will be executed when validation is successful
 * @returns function that can be used synthetic or by event handler. In second scenario default behavior and propagation will be prevented
 */
export function createHandleSubmit<T extends object>(form: FormController<T>, onSubmit: (values: T) => void): SubmitHandler {
	return (ev) => {
		if (ev) formPrevent(ev);
		form.submitted = true;
		triggerValidation(form) && onSubmit(unwrap(form.values));
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
