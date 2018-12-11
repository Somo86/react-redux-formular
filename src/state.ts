export interface IFormError {
	[key: string]: string;
}

export interface IState<T> {
	data: T;
	errors: IFormError[];
}

export default {
	data: {},
	errors: [],
} as IState<any>;
