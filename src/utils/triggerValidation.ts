import type { FormController } from '../types.ts';
import { batch } from 'solid-js';

/**
 * Trigger all fields validations
 * Useful for synthetic submissions
 * @param form controller from which the fields will be used
 * @returns if validations was successful
 *
 * @example
 * const form = createForm({ value: 5 })
 * const field = createField({ of: [form, 'value'], validate: (it) => it < 0 && 'value cannot be negative'})
 * triggerValidation(form) // -> true
 * field.errorArr // -> []
 *
 * field.onChange(-2);
 * triggerValidation(form) // -> false
 * field.errorArr // -> ['value cannot be negative']
 */
export default function triggerValidation(form: FormController<any>): boolean {
	let clear = true;
	let firstRef = true;
	form.submitted = true;
	batch(() => {
		form._fields.forEach(({ validate, getRef }) => {
			if (!validate() || !firstRef) return;
			const ref = getRef();
			if (firstRef && ref) {
				ref.focus();
				firstRef = false;
			}
			clear = false;
		});
	});
	return clear;
}
