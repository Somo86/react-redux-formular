import {
	CLEAN_FORMULAR_STATE,
	FORM_DATA_ERROR,
	IAction,
	IErrorPayload,
	IPayload,
	SET_INITIAL_STATE,
	UPDATE_FORM_DATA_TO_REDUCER,
} from './formularAction';
import {combineReducers, Reducer} from 'redux';
import * as R from 'ramda';
import initialState from './state';

interface IState {
	[key: string]: any;
}

const valuesReducer: Reducer<IState, IAction<IPayload>> = (state = initialState.data, action: IAction<IPayload>): IState => {
	switch (action.type) {
		case SET_INITIAL_STATE:
			return addInitialState(state, action);
		case UPDATE_FORM_DATA_TO_REDUCER:
			return state[action.payload.viewName] ? updateToState(state, action) : addToState(state, action);
		case CLEAN_FORMULAR_STATE:
			if (!action.payload.viewName) {
				throw new Error('Property model is required for Formular Provider');
			}
			return R.empty(state[action.payload.viewName]);
		default:
			return state;
	}
};

const errorsReducer: Reducer<IState, IAction<any>> = (state = initialState.errors, action): IState => {
	switch (action.type) {
		case FORM_DATA_ERROR:
			return state[action.payload.viewName]
				? updateErrorToState(state, action as IAction<IErrorPayload>)
				: addErrorToState(state, action as IAction<IErrorPayload>);
		case UPDATE_FORM_DATA_TO_REDUCER:
			const eventName = action.payload.event.currentTarget.name;
			if (!eventName || eventName === '') {
				throw new Error('Parameter name is empty');
			}
			return state[action.payload.viewName]
				? { ...state, [action.payload.viewName]: R.reject(R.has(eventName), state[action.payload.viewName]) }
				: { [action.payload.viewName]: state };
		case CLEAN_FORMULAR_STATE:
			if (action.payload.viewName) {
				throw new Error('Property ViewName is required for Formular Provider');
			}
			return R.empty(state[action.payload.viewName]);
		default:
			return state;
	}
};

function mergeToState(state, action) {
	return function(toMerge) {
		return R.merge(state, { [action.payload.viewName]: toMerge });
	};
}

function addInitialState(state, action: IAction<any>): IState {
	return mergeToState(state, action)(action.payload.initialState);
}

function addToState(state, action: IAction<IPayload>): IState {
	return mergeToState(state, action)(parseEvent(action, createParser));
}

function addErrorToState(state, action: IAction<IErrorPayload>): IState {
	return mergeToState(state, action)(parseToError(action));
}

function updateToState(state, action: IAction<IPayload>): IState {
	return R.assocPath(
		[action.payload.viewName],
		{ ...state[action.payload.viewName], ...parseEvent(action, updateParser(state[action.payload.viewName])) },
		state,
	);
}

function toObject(acc, messages) {
	return R.isNil(acc.find(el => R.has(R.head(R.keys(messages)))(el))) ? R.append(messages, acc) : acc;
}

function updateErrorToState(state, action: IAction<IErrorPayload>): IState {
	return R.assocPath(
		[action.payload.viewName],
		R.reduce(toObject, state[action.payload.viewName], parseToError(action)),
		state,
	);
}

function createParser(name, value): { [key: string]: any } {
	return { [name]: value };
}

function updateParser(state): (x: string, y: any) => { [key: string]: any } {
	return (name, value): { [key: string]: any } => {
		return state[name]
			? R.assocPath([name], value, state) //update existing value
			: R.merge(state, { [name]: value }); //create new value
	};
}

function parseToError(action: IAction<IErrorPayload>) {
	return action.payload.errorsList.map(error => !error.isValid && error.errorMsg);
}

function parseEvent(action: IAction<IPayload>, parser): { [key: string]: any } {
	const event = action.payload.event;
	if (event) {
		const value = event.currentTarget.value;
		const name = event.currentTarget.name;
		if (!name || name === '') {
			throw new Error('Parameter name is empty');
		}
		return parser(name, value);
	} else {
		throw new Error('parameter Event is missing');
	}
}

export default combineReducers<{ data, errors }, IAction<any>>({
	data: valuesReducer,
	errors: errorsReducer,
});
