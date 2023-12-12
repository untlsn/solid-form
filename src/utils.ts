import { LiteForm } from './createForm';
import { FoldValuePaths, PathValue } from './types';
import { DefinedLiteField } from './createField';
import { ComponentProps } from 'solid-js';

// Pick value from object and fill missing objects
export function getPathPick<V extends object, K extends FoldValuePaths<V>>(value: V, path: K): PathValue<V, K> {
	const pathArr = path.split('.');
	const last = pathArr.pop()!;

	const picker: Record<string, any> = pathArr.length ? pathArr.reduce((acc, cur) => {
		let value = acc[cur];
		if (!value) {
			value = {};
			acc[cur] = value;
		}
		return value;
	}, value as Record<string, any>) : value;

	return picker[last];
}

// Get value from store
export function getValue<V extends object, K extends FoldValuePaths<V>>(form: LiteForm<V>, path: K) {
	return getPathPick(form.store, path as FoldValuePaths<Partial<V>>);
}

/**
 * Convert value to string
 * If value is undefined or null convert to empty string
 */
export function safeStringParse(value: unknown) {
	return value == undefined ? '' : String(value);
}

// Set value from form
export function setValue<V extends object, K extends FoldValuePaths<V>>(form: LiteForm<V>, path: K, value: PathValue<V, K>) {
	(form.setStore as any)(...path.split('.'), value);
}

// Convert field to satisfies html input props
export function handleHtmlInput<T extends DefinedLiteField<string | undefined, string>>(field: T) {
	return {
		get value() {
			return safeStringParse(field.value);
		},
		onInput(ev) {
			field.onInput(ev.currentTarget.value);
		},
		onBlur: field.onBlur,
		get name() {
			return field.name;
		},
		ref: field.focusable,
		get 'aria-errormessage'() {
			return field.error;
		},
	} satisfies ComponentProps<'input'>;
}

/**
 * Convert field to satisfies html input props and handle numbers
 */
export function handleHtmlNumberInput<T extends DefinedLiteField<number | undefined, string>>(field: T) {
	return {
		get value() {
			return safeStringParse(field.value);
		},
		onInput(ev) {
			// Handle both type=number and type=string
			const value = ev.currentTarget.type == 'number'
				? ev.currentTarget.valueAsNumber
				: Number(ev.currentTarget.value);
			field.onInput(Number.isNaN(value) ? undefined : value);
		},
		onBlur: field.onBlur,
		get name() {
			return field.name;
		},
		ref: field.focusable,
		get 'aria-errormessage'() {
			return field.error;
		},
	} satisfies ComponentProps<'input'>;
}

export function handleAsUncontrolled(props: ComponentProps<'input'>) {
	return { ...props, value: undefined };
}

export function getError<V extends object, K extends FoldValuePaths<V>>(form: LiteForm<V>, path: K) {
	return form.errors[path]?.[0];
}

export function getErrorsArr<V extends object, K extends FoldValuePaths<V>>(form: LiteForm<V>, path: K) {
	return form.errors[path];
}

export function setError<V extends object, K extends FoldValuePaths<V>>(form: LiteForm<V>, path: K, error: string) {
	(form.setErrors as any)(path, [error]);
}

export function setErrorsArr<V extends object, K extends FoldValuePaths<V>>(form: LiteForm<V>, path: K, error: string[]) {
	(form.setErrors as any)(path, error);
}
export function clearErrors<V extends object, K extends FoldValuePaths<V>>(form: LiteForm<V>, path: K) {
	(form.setErrors as any)(path, undefined);
}

export function handleSubmit<V extends object>(form: LiteForm<V>): ComponentProps<'form'>['onSubmit'] {
	return (ev) => {
		ev.preventDefault();
		ev.stopPropagation();
		form.onSubmit();
	};
}
