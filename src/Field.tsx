import { JSXElement } from 'solid-js';
import { createField, type LiteFieldOptions } from './createField';
import type { FieldCore, KeyOf } from './types';

export type FieldProps<T extends object, K extends KeyOf<T>> = LiteFieldOptions<T, K> & {
	children(field: FieldCore<T[K], K>): JSXElement
}

/**
 * Component version of createField
 */
export function Field<T extends object, K extends KeyOf<T>>(props: FieldProps<T, K>) {
	return props.children(createField(props));
}
