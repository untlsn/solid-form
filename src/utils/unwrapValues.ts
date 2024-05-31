import type { FormController } from '~/types.ts';
import { unwrap } from 'solid-js/store';

/**
 * @deprecated FormController now use T instead of Partial<T>. Instead use solidjs unwrap
 */
export default function unwrapValues<T extends object>(form: FormController<T>) {
	return unwrap(form.values) as T;
}
