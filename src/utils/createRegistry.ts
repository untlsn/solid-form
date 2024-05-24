import type { FormController, KeyOf, Validation } from '~/types.ts';
import { createField } from '~/createField.ts';

export default function createRegistry<T extends object>(formState: FormController<T>) {
	return <K extends KeyOf<T>>(name: K, validate?: Validation<Partial<T>[K]>) => createField({
		of: [formState, name],
		validate,
	});
}
