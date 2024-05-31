import { FormController } from '~/types.ts';

/**
 * @deprecated formController should not be extended
 */
export default function formSetup<T extends object, TExtends extends object>(
	cb: () => FormController<T> & TExtends,
) {
	return cb();
}
