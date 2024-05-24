import { FieldCore } from '~/types.ts';
import { safeStringParse } from '~/internalUtils.ts';

/** Convert field to satisfies html input props */
export default function handleHtmlInput<T extends FieldCore<string | undefined>>(field: T) {
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
