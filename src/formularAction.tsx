import { ChangeEvent } from 'react';
import * as R from 'ramda';
import { IListValidations, listValidations } from './validations';

export const UPDATE_FORM_DATA_TO_REDUCER = 'UPDATE_FORM_DATA_TO_REDUCER';
export const FORM_DATA_ERROR = 'FORM_DATA_ERROR';
export const CLEAN_FORMULAR_STATE = 'CLEAN_FORMULAR_STATE';
export const SET_INITIAL_STATE = 'SET_INITIAL_STATE';

export type TValidations = { [key: string]: IValidations };

export interface IValidations {
	validations?: IEvaluator[];
	isRequired: boolean;
}

export interface IEvaluator {
	evaluate: Function;
	errorMsg: string;
}

export interface IAction<T> {
	type: string;
	payload: T;
}

export interface IPayloadBase {
	viewName: string;
}

export interface IPayload extends IPayloadBase {
	event: ChangeEvent<any>;
}

export interface IErrorPayload extends IPayloadBase {
	errorsList: IListValidations[];
}

export interface IInitialStatePayload extends IPayloadBase {
	initialState: IListValidations[];
}

export const cleanState = (viewName: string): IAction<{ viewName }> => ({
	type: CLEAN_FORMULAR_STATE,
	payload: { viewName },
});

export const dispatchUpdateAction = (viewName: string, event: ChangeEvent): IAction<IPayload> => ({
	type: UPDATE_FORM_DATA_TO_REDUCER,
	payload: {
		viewName,
		event,
	},
});

export const dispatchErrorAction = (viewName: string, errorsList: IListValidations[]): IAction<IErrorPayload> => ({
	type: FORM_DATA_ERROR,
	payload: {
		viewName,
		errorsList,
	},
});

export const dispatchInitialState = (viewName: string, initialState: IListValidations[]): IAction<IInitialStatePayload> => ({
	type: SET_INITIAL_STATE,
	payload: {
		viewName,
		initialState,
	},
});

const isValid = (event, config = {}): IListValidations[] | any[] => {
	const value = event.currentTarget.value;
	const name = event.currentTarget.name;
	const validations = R.pathOr(null, ['validations'], config[name]);
	if (!validations || !R.length(validations)) {
		return [];
	} // empty validations automatic valid

	return validations.map(listValidations(value, name)).filter(list => list.isValid === false);
};

export default (viewName: string, config: TValidations | undefined) => (event: ChangeEvent<any>): IAction<any> => {
	const isValidResults = isValid(event, config);
	return R.length(isValidResults) === 0
		? dispatchUpdateAction(viewName, event)
		: dispatchErrorAction(viewName, isValidResults);
};
