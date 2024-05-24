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

export type LiteFieldController = {
	ref?():   HTMLElement | undefined,
	validate(): boolean
	/** @DEV */
	error?: string[]
}

type FullSetter<T> = (old: T) => T;

export type FormController<T extends object> = {
	initialValues?: Partial<T>,
	values:         Partial<T>,
	setValues<K extends keyof T>(key: K, value: T[K]): void,
	setValues(whole: FullSetter<Partial<T>>,): void,
	_fields:        LiteFieldController[],

	submitted?: boolean
}

export type FieldCore<T, K extends string = string> = {
	get value(): T | undefined
	onChange(value: T): void
	name: K
	get error(): string | undefined
	get errorArr(): string[] | undefined
	// Allow form to focus on error
	ref(element: HTMLElement): void

	setErrors: Setter<string[] | undefined>
	validate(): boolean,
}
