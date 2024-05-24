
import { FormController } from '~/types.ts';

/** Set value only when value is defined */
export default function setDefinedValue<T extends object, K extends keyof T>(form: FormController<T>, name: K, value: T[K] | undefined | null) {
	if (value == undefined) return;
	form.setValues(name as any, value);
}
