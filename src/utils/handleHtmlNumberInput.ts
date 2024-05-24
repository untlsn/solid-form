import { FieldCore } from '~/types.ts';
import { safeStringParse } from '~/internalUtils.ts';
import { ComponentProps } from 'solid-js';

/**
 * Convert field to satisfies html input props and handle number. Force input to be number
 */
export default function handleHtmlNumberInput<T extends FieldCore<number | undefined>>(field: T) {
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
