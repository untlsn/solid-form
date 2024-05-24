import type { FormController } from '~/types.ts';

export default function formWith<T extends object, TExtends extends object>(
	formState: FormController<T>,
	withObj: (form: FormController<T>) => TExtends,
): FormController<T> & TExtends {
	return Object.assign(formState, withObj(formState));
}
