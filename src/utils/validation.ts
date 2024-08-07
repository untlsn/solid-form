import type { FormController, Validation } from '../types.ts';
import { batch, onMount } from 'solid-js';

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
export function triggerValidation(form: FormController<any>): boolean {
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

/**
 * It will convert array of validations to single validate function
 * @param arr array of validate function that will be compressed to single validate function
 * @example
 * validationSome<number>([
 *   (it) => !it && 'Field required',
 *   (it) => it < 5 && 'Field must be at least 5'
 * ])
 * // Work like this:
 * (it) => {
 *   if (!it) return 'Field required';
 *   if (it < 5) return 'Field must be at least 5'
 * }
 */
export function validationSome<T>(arr: Exclude<Validation<T>, undefined>[]): Validation<T> {
	return (value) => {
		for (const fn of arr) {
			const errors = fn(value);
			if (!errors || Array.isArray(errors) && !errors.length) continue;
			return errors;
		}
	};
}

/**
 * Insert validateSignal for all fields in form on first mount
 * @returns function that will rebind validateSignal for fields including newest
 */
export function mountValidationSignal(form: FormController<object>, validateSignal: () => void): () => void {
	const cb = () => {
		form._fields.forEach((it) => {
			it.validateSignal = validateSignal;
		});
	};
	onMount(cb);
	return cb;
}
