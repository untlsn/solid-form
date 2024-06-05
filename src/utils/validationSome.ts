import type { Validation } from '../types.ts';

/**
 * It will convert array of validations to single validate function
 * @param arr array of validate function that will be compressed to single validate function
 * @example
 * validationSome<number>([
 *   (it) => !it && 'Field required',
 *   (it) => it < 5 && 'Field must be at least 5'
 * ])
 * // Work like this:
 * (it) => {
 *   if (!it) return 'Field required';
 *   if (it < 5) return 'Field must be at least 5'
 * }
 */
export default function validationSome<T>(arr: Exclude<Validation<T>, undefined>[]): Validation<T> {
	return (value) => {
		for (const fn of arr) {
			const errors = fn(value);
			if (!errors || Array.isArray(errors) && !errors.length) continue;
			return errors;
		}
	};
}
