import type { FormController } from '~/types.ts';
import { unwrap } from 'solid-js/store';

export default function unwrapValues<T extends object>(form: FormController<T>) {
	return unwrap(form.values) as T;
}
