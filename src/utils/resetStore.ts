import type { FormController } from '~/types.ts';
import { reconcile } from 'solid-js/store';

export default function resetStore(form: FormController<any>) {
	const init = form.initialValues;
	form.setValues(reconcile(init || {}));
}
