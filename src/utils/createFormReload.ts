// Track initialValues and reset store when values change
import { createEffect } from 'solid-js';
import { FormController } from '~/types.ts';
import { reconcile } from 'solid-js/store';

export default function createFormReload<T extends object>(formStore: FormController<T>, values: () => Partial<T> | undefined) {
	let first = true;

	createEffect(() => {
		const snap = values() || {};
		if (first) return first = false;
		formStore.setValues(reconcile(snap));
	});

	return formStore;
}
