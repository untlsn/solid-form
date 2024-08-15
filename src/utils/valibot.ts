import type { FormController, SubmitHandler } from '../types';
import * as v from 'valibot';
import { unwrap } from 'solid-js/store';
import { mountValidationSignal } from './validation';
import { createHandleSubmit } from './handleSubmit';

/**
 * Check form with schema validation\
 * If validation pass it return output of validation\
 * Otherwise it set nested errors into fields and throw root error
 *
 * @example
 * const Schema = v.object({ value: v.pipe(v.string(), v.minLength(2, 'To short')) })
 * const field = sf.createField({ form, name: 'value' });
 *
 * field.onChange('A');
 * sf.validateForm(Schema, form)
 * field.error // |> 'To short'
 *
 * field.onChange('ABC');
 * sf.validateForm(Schema, form)
 * field.error // |> undefined
 */
export function validateForm<T extends v.BaseSchema<any, any, any>>(schema: T, form: FormController<v.InferInput<T>>): v.InferOutput<T> {
	const parse = v.safeParse(schema, unwrap(form.values));
	if (parse.success) {
		form._fields.forEach((field) => {
			field.setErrors(undefined);
		});
		return parse.output;
	}
	const flat = v.flatten(parse.issues);
	const nested: Record<string, string[] | undefined> = flat.nested || {};
	form._fields.forEach((field) => {
		field.setErrors(nested[field.name]);
	});
	throw flat.root;
}

type ValibotFormTuple<T extends v.BaseSchema<any, any, any>> = readonly [FormController<v.InferInput<T>>, SubmitHandler];

/**
 * Fully integrate form with valibot\
 * Equivalent of validateForm, createHandleSubmit and mountValidationSignal combined
 *
 * @example
 * const [form, submit] = sf.useValibotForm(sf.createForm(), Schema, onSubmit);
 *
 * // Same as
 *
 * const form = sf.createForm();
 * const validate = () => sf.validateForm(Schema, form);
 * sf.mountValidationSignal(form, validate);
 * const submit = sf.createHandleSubmit(form, () => onSubmit(validate()));
 */
export function useValibotForm<T extends v.BaseSchema<any, any, any>>(
	form: FormController<v.InferInput<T>>,
	schema: T,
	onSubmit: (values: v.InferOutput<T>) => void,
): ValibotFormTuple<T> {
	const validate = () => validateForm(schema, form);
	mountValidationSignal(form, validate);
	const submit = createHandleSubmit(form, () => onSubmit(validate()));

	return [form, submit];
}

export { useValibotForm as asValibotForm };
