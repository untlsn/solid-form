import type { MaybeArray } from '@untlsn/utils';
import type { Setter } from 'solid-js';
import type * as v from 'valibot';
import type { KeyOf } from '@untlsn/utils';

/**
 * Simple function that can consume event and disable it default and propagation\
 * Additionally it can contain error
 */
export type SubmitHandler = ((ev?: Event) => void) & { error?: unknown };

export type { KeyOf };
/** Required validation of field */
export type ReqValidation<T> = {
	(value: T): MaybeArray<any>,
	empty?: false,
};
/** Not pure validation that not require any input. Mainly validation of other field */
export type EmptyValidation = {
	(): MaybeArray<any>,
	empty: true,
};
/** Any validation that can be used with fields */
export type Validation<T> = ReqValidation<T> | EmptyValidation | undefined;

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
};

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
 * @prop validateSignal is triggered every time validation will happen. Halt validation when throw
 *
 */
export type FieldCore<T, K extends string | undefined = string> = {
	get value(): T
	onChange: (value: T) => void
	name:     K
	get error(): string | undefined
	get errorArr(): string[] | undefined
	ref:      (element: HTMLElement) => void
	getRef:   () => HTMLElement | undefined

	setErrors:       Setter<string[] | undefined>
	validate:        (isolated?: boolean) => boolean,
	validateSignal?: () => void,
};
/**
 * Shortcut for FieldCore<unknown, string | undefined>
 * Useful when want to handle bunth of field and don't know they types
 */
export type AnyFieldCore = FieldCore<any, string | undefined>;

/** Allow strict or nullable version of field */
export type LooseFieldCore<T, K extends string | undefined = string> = FieldCore<T, K> | FieldCore<T | undefined, K>;

export type { Path, PathValue } from '@untlsn/utils';
/** ObjectSchema with all generics set to any */
export type AnyObjectSchema = v.ObjectSchema<any, any>;
/** Array that have at least one element */
export type NonEmptyArray<T> = [T, ...T[]];
