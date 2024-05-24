import type { Validation } from '~/types.ts';

export default function validationSome<T>(arr: Exclude<Validation<T>, undefined>[]): Validation<T> {
	return (value) => {
		for (const fn of arr) {
			const errors = fn(value);
			if (!errors || Array.isArray(errors) && !errors.length) continue;
			return errors;
		}
	};
}
