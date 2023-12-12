import { createField, LiteField, LiteFieldOptions } from './createField';
import { FoldValuePaths } from './types';
import { LiteForm } from './createForm';
import { JSXElement } from 'solid-js';

export type FieldProps<V extends object, K extends FoldValuePaths<V>> = LiteFieldOptions<V, K> & {
	children(field: LiteField<V, K>): JSXElement
}

export function Field<V extends object, K extends FoldValuePaths<V>>(props: FieldProps<V, K>) {
	return props.children(createField(props));
}

export function createFieldFactory<V extends object>(form: LiteForm<V>) {
	return <K extends FoldValuePaths<V>>(props: Omit<FieldProps<V, K>, 'of'>) => (
		<Field of={form} {...props}>
			{props.children}
		</Field>
	);
}
