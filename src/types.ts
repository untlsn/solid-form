import type { Accessor, Setter } from 'solid-js';

export type MaybeArray<T> = T | T[];
export type KeyOf<T> = Extract<keyof T, string>;
export type KeyOfType<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T] & string;
export type ValidationReturn = MaybeArray<string | any>;
export type MaybeAccessor<T> = T | Accessor<T>
export type ReqValidation<T> = {
	(value: T | undefined): ValidationReturn,
	// Is empty is true, then function will be triggered without value and return is ignored
	empty?: boolean
}
export type Validation<T> = ReqValidation<T> | undefined

/**
 * Object that contain necessary props for form
 * @prop values - store containing form values
 * @prop _fields - array of field assigned to this for that allow you to handle
 * @prop submitted
 */
export type FormController<T extends object> = {
	values:  T,
	_fields: FieldCore<any, any>[],

	submitted?: boolean
}

/**
 * Object that all field should use or at least extend
 * @prop value trackable getter that return value assigned to field
 * @prop onChange function that require same type as value prop, should change value assigned to field
 * @prop name name of field
 * @prop error shortcut for errorArr[0]
 * @prop errorArr array that contain all errors that validate return
 * @prop ref function that assign html element to field
 * @prop getRef return html element assigned to field
 * @prop setErrors function that change errors of field, in 90% cases should not be used directly
 * @prop validate function that validate field and return if field is successfully validated
 *
 */
export type FieldCore<T, K extends string | undefined = string> = {
	get value(): T
	onChange(value: T): void
	name: K
	get error(): string | undefined
	get errorArr(): string[] | undefined
	ref(element: HTMLElement): void
	getRef(): HTMLElement | undefined

	setErrors: Setter<string[] | undefined>
	validate(): boolean,
}
/**
 * Shortcut for FieldCore<unknown, string | undefined>
 * Useful when want to handle bunth of field and don't know they types
 */
export type AnyFieldCore = FieldCore<unknown, string | undefined>
