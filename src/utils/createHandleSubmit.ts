import type { FormController } from '../types.ts';
import { unwrap } from 'solid-js/store';
import formPrevent from './formPrevent.ts';
import triggerValidation from './triggerValidation.ts';

/**
 * Create submitter for form. When executed form.submitted will be toggled to true, all fields validation will be triggered and if validation is successful onSubmit argument will be executed
 * @param form - form controller
 * @param onSubmit - function that will be executed when validation is successful
 * @returns function that can be used synthetic or by event handler. In second scenario default behavior and propagation will be prevented
 */
export default function createHandleSubmit<T extends object>(form: FormController<T>, onSubmit: (values: T) => void): (ev?: Event) => void {
	return (ev) => {
		if (ev) formPrevent(ev);
		form.submitted = true;
		triggerValidation(form) && onSubmit(unwrap(form.values));
	};
}
