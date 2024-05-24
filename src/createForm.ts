import { createStore } from 'solid-js/store';
import type { FormController, LiteFieldController } from './types';

export function createForm<T extends object>(initialValues?: Partial<T>): FormController<T> {
	const [values, setValues] = createStore<Partial<T>>(initialValues);
	const _fields: LiteFieldController[] = [];

	if (import.meta.env.DEV) {
		window.form = () => ({
			initialValues,
			values, setValues,
			_fields,
		});
	}

	return {
		initialValues,
		values, setValues,
		_fields,
	};
}
