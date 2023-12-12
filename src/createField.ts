import { FoldValuePaths, MaybeArray, PathValue } from './types';
import { LiteForm } from './createForm';
import {
	clearErrors,
	getError,
	getErrorsArr,
	getValue,
	setErrorsArr,
	setValue,
} from './utils';
import { asArray } from './internalUtils';
import { createEffect } from 'solid-js';

export type LiteField<V extends object = object, K extends FoldValuePaths<V> = any> = DefinedLiteField<PathValue<V, K>, K>

// LiteField with predefined types
export type DefinedLiteField<V, K extends string> = {
	get value(): V
	onInput(value: V): void
	onBlur(): void
	name: K
	get error(): string | undefined
	get errorArr(): string[]
	// Allow form to focus on error
	focusable(element: HTMLElement): void
}

type ValidateOn = 'input' | 'blur';

export type LiteFieldOptions<V extends object, K extends FoldValuePaths<V>> = {
	of:          LiteForm<V>,
	path:        K,
	validation?(value: PathValue<V, K>): MaybeArray<string> | undefined
	/**
	 * Set when validation should run
	 * input - when onInput is triggered
	 * blur - when onBlur is triggered
	 * @default input
	 */
	validateOn?: ValidateOn
}

export function createField<V extends object, K extends FoldValuePaths<V>>(options: LiteFieldOptions<V, K>): LiteField<V, K> {
	const validate = (value: PathValue<V, K>) => {
		if (!options.validation || !options.of.canValidate) return;

		const errors = options.validation!(value);
		if (!errors) return clearErrors(options.of, options.path);
		setErrorsArr(options.of, options.path, asArray(errors));
	};

	const res: LiteField<V, K> = {
		get value() {
			return getValue(options.of, options.path) as PathValue<V, K>;
		},
		onInput(value) {
			setValue(options.of, options.path, value);
			options.validateOn != 'blur' && validate(value);
		},
		onBlur() {
			options.validateOn == 'blur' && validate(res.value);
		},
		get error() {
			return getError(options.of, options.path);
		},
		get errorArr() {
			return getErrorsArr(options.of, options.path);
		},
		get name() {
			return options.path;
		},
		focusable(element: HTMLElement) {
			createEffect(() => {
				if (!res.error) return void element.removeAttribute('data-error-focus');
				element.setAttribute('data-error-focus', options.of.name);
			});
		},
	};

	createEffect(() => {
		if (!options.validation || !options.of.dirty) return;
		// When form is submitted trigger all validation
		validate(res.value);
	});

	return res;
}
