import type { FieldCore, FormController, Validation } from '../types.ts';
import { batch, type ComponentProps, createEffect } from 'solid-js';
import { reconcile, unwrap } from 'solid-js/store';

// Track initialValues and reset store when values change
export function createFormReload<T extends object>(formStore: FormController<T>, values: () => Partial<T> | undefined) {
	let first = true;

	createEffect(() => {
		const snap = values() || {};
		if (first) return first = false;
		formStore.setValues(reconcile(snap));
	});

	return formStore;
}

export function resetStore(form: FormController<any>) {
	const init = form.initialValues;
	form.setValues(reconcile(init || {}));
}
/**
 * Convert value to string
 * If value is undefined, null or object convert to empty string
 */
export function safeStringParse(value: unknown): string {
	return value == undefined || typeof value == 'object' ? '' : String(value);
}

// Set value only when value is defined
export function setDefinedValue<T extends object, K extends keyof T>(form: FormController<T>, name: K, value: T[K] | undefined | null) {
	if (value == undefined) return;
	form.setValues(name, value);
}

// Convert field to satisfies html input props
export function handleHtmlInput<T extends FieldCore<string | undefined>>(field: T) {
	return {
		get value() {
			return safeStringParse(field.value);
		},
		onInput(ev: { currentTarget: { value: string } }) {
			field.onChange(ev.currentTarget.value);
		},
		get name() {
			return field.name;
		},
		get id() {
			return field.name;
		},
		ref(ref: HTMLElement) {
			field.ref(ref);
		},
		get 'aria-errormessage'() {
			return field.error;
		},
	};
}

/**
 * Create validations that work only if inner flag match validation flag.
 * Useful when form have multiple submit buttons that require deferment validation
 * Remember undefined is flag too
 *
 * @param defaultInnerFlag - default flag for check
 * @param defaultValidationFlag - default flag of validation
 */
export function createFlagValidationFactory<TFlag = unknown>(defaultInnerFlag?: TFlag, defaultValidationFlag?: TFlag): [
	createValidation: <T>(cb: Validation<T>, flag?: TFlag) => Validation<T>,
	setFlag: (newFlag: TFlag) => void
] {
	let flag = defaultInnerFlag;

	return [
		(cb, validationFlag = defaultValidationFlag) => {
			return (value) => {
				if (flag != validationFlag) return;
				return cb?.(value);
			};
		},
		(newFlag) => {
			flag = newFlag;
		},
	];
}

/**
 * Convert field to satisfies html input props and handle number. Force input to be number
 */
export function handleHtmlNumberInput<T extends FieldCore<number | undefined>>(field: T) {
	return {
		get value() {
			return safeStringParse(field.value);
		},
		type: 'number',
		onInput(ev) {
			const value = ev.currentTarget.valueAsNumber;
			field.onChange(isNaN(value) ? undefined : value);
		},
		get name() {
			return field.name;
		},
		ref(ref) {
			field.ref(ref);
		},
		get 'aria-errormessage'() {
			return field.error;
		},
	} satisfies ComponentProps<'input'>;
}

export function unwrapValues<T extends object>(form: FormController<T>) {
	return unwrap(form.values) as T;
}


export function triggerValidation(form: FormController<any>) {
	let clear = true;
	let firstRef = true;
	form.submitted = true;
	batch(() => {
		form._fields.forEach(({ validate, ref: getRef }) => {
			if (!validate() || !firstRef) return;
			const ref = getRef?.();
			if (firstRef && ref) {
				ref.focus();
				firstRef = false;
			}
			clear = false;
		});
	});
	return clear;
}

export function formPrevent(ev: Event) {
	ev.preventDefault();
	ev.stopPropagation();
}

export function createHandleSubmit<T extends object>(form: FormController<T>, onSubmit: (values: T) => void) {
	return (ev?: Event) => {
		if (ev) formPrevent(ev);
		form.submitted = true;
		triggerValidation(form) && onSubmit(unwrap(form.values) as any);
	};
}

/**
 * This function just execute cb
 * @param cb return extended form, feel free to mutate form object
 */
export function formSetup<T extends object, TExtends extends object>(
	cb: () => FormController<T> & TExtends,
) {
	return cb();
}

export function formWith<T extends object, TExtends extends object>(
	formState: FormController<T>,
	withObj: (form: FormController<T>) => TExtends,
): FormController<T> & TExtends {
	return Object.assign(formState, withObj(formState));
}

export function validationSome<T>(arr: Exclude<Validation<T>, undefined>[]): Validation<T> {
	return (value) => {
		for (const fn of arr) {
			const errors = fn(value);
			if (!errors || Array.isArray(errors) && !errors.length) continue;
			return errors;
		}
	};
}

export function createPredefinedGetter<T extends object, R>(formStore: FormController<T>, cb: (value: T) => R) {
	return () => cb(unwrap(formStore.values) as any);
}

type ObjectSetter<T extends object> = { [K in keyof T]?: (oldValue: T[K]) => T[K] | undefined };

export function createSetter<T extends object>(formStore: FormController<T>, values: ObjectSetter<T>) {
	Object.entries(values).forEach(([key, setter]) => {
		createEffect(() => {
			(formStore.setValues as any)(key, setter);
		});
	});
}
