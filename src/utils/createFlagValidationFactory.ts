import { Validation } from '../types.ts';

/**
 * Create validations that work only if inner flag match validation flag.
 * Useful when form have multiple submit buttons that require deferment validation
 * Remember undefined is flag too
 *
 * @param defaultInnerFlag - default flag for check
 * @param defaultValidationFlag - default flag of validation
 */
export default function createFlagValidationFactory<TFlag = unknown>(defaultInnerFlag?: TFlag, defaultValidationFlag?: TFlag): [
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
