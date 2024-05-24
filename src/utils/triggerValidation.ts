import type { FormController } from '~/types.ts';
import { batch } from 'solid-js';

export default function triggerValidation(form: FormController<any>) {
	let clear = true;
	let firstRef = true;
	form.submitted = true;
	batch(() => {
		form._fields.forEach(({ validate, ref: getRef }) => {
			if (!validate() || !firstRef) return;
			const ref = getRef?.();
			if (firstRef && ref) {
				ref.focus();
				firstRef = false;
			}
			clear = false;
		});
	});
	return clear;
}
