export interface IListValidations {
	errorMsg: { [key: string]: string };
	isValid: boolean;
}

export const listValidations = (value, name): Function => (validator): IListValidations => ({
	isValid: validator.evaluate(value),
	errorMsg: { [name]: validator.errorMsg },
});

/**/ /**/ /**/ /* Valiations */

const maxLength: Function = max => (value): boolean => value.length <= max;

const minLength: Function = min => (value): boolean => value.length >= min;

const emailFormat = (value): boolean => {
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(value).toLowerCase());
};

export default { maxLength, minLength, emailFormat };
