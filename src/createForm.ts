import { createStore } from 'solid-js/store';
import type { FormController, LiteFieldController } from './types';

export function createForm<T extends object>(initialValues: T): FormController<T>
export function createForm<T extends object>(): FormController<Partial<T>>
export function createForm<T extends object>(initialValues?: T): FormController<Partial<T>> {
	const [values, setValues] = createStore<Partial<T>>(initialValues);
	const _fields: LiteFieldController[] = [];

	return {
		values, setValues,
		_fields,
	};
}
