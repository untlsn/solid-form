import { createStore, SetStoreFunction, unwrap } from 'solid-js/store';
import { FoldValuePaths } from './types';
import { createSignal, createUniqueId } from 'solid-js';

export type LiteForm<T extends object = object> = {
	name:        string,
  store:      Partial<T>,
	setStore:    SetStoreFunction<Partial<T>>,
	errors:      Record<FoldValuePaths<T>, string[]>
	setErrors:   SetStoreFunction<Record<FoldValuePaths<T>, string[]>>
	dirty:       boolean
	onSubmit(): void
	canValidate: boolean
}

export type LiteFormOptions<T extends object = object> = Partial<{
	initialValues:   Partial<T>
	onSubmit?(values: T): void
	// If true validation will not wait for first submit
	earlyValidation: boolean
}>

export function createForm<T extends object>(options: LiteFormOptions<T> = {}): LiteForm<T> {
	const name = createUniqueId();
	const [store, setStore] = createStore<Partial<T>>(options.initialValues || {}, {
		name: `values:${name}`,
	});
	const [errors, setErrors] = createStore<Record<string, string[]>>({}, {
		name: `errors:${name}`,
	});
	const [dirty, setDirty] = createSignal(false, {
		name: `dirty:${name}`,
	});

	return {
		name,
		store,
		setStore,
		errors,
		setErrors,
		get dirty() {
			return dirty();
		},
		get canValidate() {
			return options.earlyValidation || dirty();
		},
		onSubmit() {
			setDirty(true);
			if (Object.values(unwrap(errors)).some(Boolean)) {
				return (document.querySelector('[data-error-focus]') as HTMLElement)?.focus();
			}
			options.onSubmit?.(unwrap(store as any));
		},
	};
}
