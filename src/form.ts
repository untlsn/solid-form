import { createMutable } from 'solid-js/store';
import type { FormController } from './types';

/**
 * Create instance of form store
 * It doesn't do anything on its own, it just stores the form data and the forms that exist in it
 * Form access all values that can be wrapped with solid `createStore`
 *
 * Usage:
 * @example
 * const form = createForm({ value: 5, deepValue: { a: 1, b: 2, c: 'string' } })
 *
 * createField({ of: [form, 'value'], validate: (it) => it < 0 && 'value cannot be negative'})
 * createField({ of: [form, 'deepValue'], validate: (it) => it.a == it.b && 'deepValue a and b must be identical' })
 * @param initialValues values that will be passed to store (object will be mutated)
 */
export function createForm<T extends object>(initialValues: T): FormController<T>
export function createForm<T extends object>(): FormController<Partial<T>>
export function createForm<T extends object>(initialValues?: T): FormController<Partial<T>> {
	const values = createMutable<Partial<T>>(initialValues || {});

	return { values, _fields: [] };
}
