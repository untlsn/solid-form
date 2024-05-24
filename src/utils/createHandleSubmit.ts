import type { FormController } from '~/types.ts';
import { unwrap } from 'solid-js/store';
import formPrevent from '~/utils/formPrevent.ts';
import triggerValidation from '~/utils/triggerValidation.ts';

export default function createHandleSubmit<T extends object>(form: FormController<T>, onSubmit: (values: T) => void) {
	return (ev?: Event) => {
		if (ev) formPrevent(ev);
		form.submitted = true;
		triggerValidation(form) && onSubmit(unwrap(form.values) as any);
	};
}
