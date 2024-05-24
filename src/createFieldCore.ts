import { createSignal, onCleanup, type Accessor, type Setter } from 'solid-js';
import type { LiteFieldController, MaybeAccessor, Validation } from './types';
import { triggerFieldValidation } from './utils';
import { access } from './internalUtils';

export type FieldCoreOptions<T, K extends string | undefined = undefined> = {
	value: Accessor<T>
	setValue(newValue: T): void

	fieldList: LiteFieldController[],

	submitted: MaybeAccessor<boolean | undefined>
	name:      K,
	/**
	 * Maybe array of functions that return one or more errors. Falsy values will be ignored
	 */
	validate?: Validation<T>
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

export function createFieldCore<T, K extends string = string>(options: FieldCoreOptions<T, K>): FieldCore<T, K> {
	const [ref, setRef] = createSignal<HTMLElement>();
	const [errors, setErrors] = createSignal<string[]>();

	const validate = () => {
		const submitted = access(options.submitted);
		const validate = options.validate;
		if (!validate || !submitted) return false;
		if (validate.empty) return validate(undefined);
		const newErrors = triggerFieldValidation(options.value(), validate);
		setErrors(newErrors);
		return !!newErrors?.length;
	};
	validate.empty = true;

	const self = {
		onChange: options.setValue,
		name:     options.name,
		validate,
		get value() {
			return options.value();
		},
		ref: setRef,
		get error() {
			return errors()?.[0];
		},
		get errorArr() {
			return errors();
		},
		setErrors,
	};

	const field = options.fieldList;
	const fieldController: LiteFieldController = import.meta.env.DEV ? {
		ref, validate, get error() {
			return errors();
		},
	} : { ref, validate };

	field.push(fieldController);

	onCleanup(() => {
		field.splice(field.indexOf(fieldController), 1);
	});

	return self;
}
