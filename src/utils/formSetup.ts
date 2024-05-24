import { FormController } from '~/types.ts';

/**
 * This function just execute cb
 * @param cb return extended form, feel free to mutate form object
 */
export default function formSetup<T extends object, TExtends extends object>(
	cb: () => FormController<T> & TExtends,
) {
	return cb();
}
