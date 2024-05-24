import { createField, type LiteField, type LiteFieldOptions } from './createField';
import type { FormController, KeyOf } from './types';

export type FieldProps<T extends object, K extends KeyOf<T>> = LiteFieldOptions<T, K> & {
	children(field: LiteField<T, K>): JSXElement
}

export function Field<T extends object, K extends KeyOf<T>>(props: FieldProps<T, K>) {
	return props.children(createField(props));
}

export function createFieldFactory<T extends object>(form: FormController<T>) {
	return <K extends KeyOf<T>>(props: Omit<FieldProps<T, K>, 'of'> & { name: K }) => (
		<Field of={[form, props.name]} {...props}>
			{props.children}
		</Field>
	);
}
