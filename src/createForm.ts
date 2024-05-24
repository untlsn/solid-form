import { createStore } from 'solid-js/store';
import type { FormController, LiteFieldController } from './types';

export function createForm<T extends object>(initialValues?: Partial<T>): FormController<T> {
	const [values, setValues] = createStore<Partial<T>>(initialValues);
	const _fields: LiteFieldController[] = [];

	return {
		initialValues,
		values, setValues,
		_fields,
	};
}
