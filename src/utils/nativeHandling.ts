import type { FieldCore, LooseFieldCore } from '../types.ts';
import { safeStringParse } from '../internalUtils.ts';

type OnEvent = (ev: { currentTarget: HTMLInputElement }) => void;

type NativeHandler = {
	readonly value:                string,
	readonly name:                 string,
	readonly id:                   string,
	type?:                         string,
	onInput?:                      OnEvent
	onChange?:                     OnEvent
	ref:                           (ref: HTMLElement) => void,
	readonly 'aria-errormessage'?: string,
};

type NativeHandlerEvent = 'input' | 'change';

function injectEvent(handler: NativeHandler, eventFn: OnEvent, eventType: NativeHandlerEvent = 'input') {
	if (eventType == 'change') handler.onChange = eventFn;
	else handler.onInput = eventFn;
	return handler;
}

/** Convert field to satisfies html input props */
export function handleHtmlInput<T extends LooseFieldCore<string>>(
	field: T,
	eventType: NativeHandlerEvent = 'input',
): NativeHandler {
	return injectEvent(
		{
			get value() {
				return safeStringParse(field.value);
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
		},
		(ev: { currentTarget: { value: string } }) => {
			field.onChange(ev.currentTarget.value);
		},
		eventType,
	);
}

/**
 * Convert field to satisfies html input props and handle number. Force input to be number
 */
export function handleHtmlNumberInput<T extends FieldCore<number | undefined>>(
	field: T,
	eventType: NativeHandlerEvent = 'input',
) : NativeHandler {
	return injectEvent(
		{
			get value() {
				return safeStringParse(field.value);
			},
			type: 'number',
			get name() {
				return field.name;
			},
			get id() {
				return field.name;
			},
			ref(ref) {
				field.ref(ref);
			},
			get 'aria-errormessage'() {
				return field.error;
			},
		},
		(ev) => {
			const value = ev.currentTarget.valueAsNumber;
			field.onChange(isNaN(value) ? undefined : value);
		},
		eventType,
	);
}
