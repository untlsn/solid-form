import type { FormController, SubmitHandler } from '../types.ts';
import { unwrap } from 'solid-js/store';
import formPrevent from './formPrevent.ts';
import triggerValidation from './triggerValidation.ts';
import { type Accessor, startTransition, useTransition } from 'solid-js';

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
 * Wrap function with transition. Should be used always when submission is passed to query or action
 */
export function useWithTransition(submit: SubmitHandler): [Accessor<boolean>, SubmitHandler] {
	const [pending, start] = useTransition();

	return [
		pending,
		(ev) => start(() => submit(ev)),
	];
}

/**
 * Wrap function with transition. Should be used always when submission is passed to query or action, but don't return pending state
 */
export function withTransition(submit: SubmitHandler): SubmitHandler {
	return (ev) => startTransition(() => submit(ev));
}
