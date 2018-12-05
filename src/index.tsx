//dependencies
import * as React from 'react';
import { Context } from 'react';
import { componentDidMount } from 'react-functional-lifecycle';
import { connect } from 'react-redux';
import createContext from './utils/createContext';
import {
	default as actionCreator,
	cleanState as cleanStateAction,
	TValidations,
	dispatchInitialState,
} from './formularAction';
import { default as formularReducer } from './formularReducer';
import { IState as IFormularState } from './state';
import { default as validations } from './validations';
import * as R from 'ramda';
import { isEmptyOrNil } from './utils';

interface IProps extends IProviderValues{
	children: JSX.Element;
	initialState?: { [key: string]: any };
}

interface IProviderValues {
  model: string;
  validations?: TValidations | undefined;
}

interface IStateRedux {
	formular: any;
}

interface IDispatchRedux {
  cleanFormularState: (x) => void;
}

interface IControllerProps {
	children: JSX.Element;
	name: string;
}

interface IControllerDispatch {
	updateFormularState: (Function) => (ev) => void;
}

const FormularContext: Context<IProviderValues> = createContext({});

const provider: React.StatelessComponent<IProps & IStateRedux> = (props: IProps) => {
	return (
		<FormularContext.Provider value={{ model: props.model, validations: props.validations }}>
			{ props.children }
		</FormularContext.Provider>
	);
};

const FormularProvider = connect<IStateRedux, IDispatchRedux, IProps>(
	mapStateToProps,
	mapDispatchToProps,
)(componentDidMount(componentDidMountFunctional)(provider));

const controller: React.StatelessComponent<IControllerProps & IControllerDispatch> = (
	props: IControllerProps & IControllerDispatch,
) => {
	return (
		<FormularContext.Consumer>
			{(context: any): React.StatelessComponent<IControllerProps & IControllerDispatch> => {
				const actionDispatcher: Function = props.updateFormularState(actionCreator(context.model, context.validations));
				return React.Children.map(props.children, child =>
					React.cloneElement(child as any, { onChange: actionDispatcher, name: props.name }),
				) as any;
			}}
		</FormularContext.Consumer>
	);
};

const Controller = connect<{}, IControllerDispatch, IControllerProps>(
  () => ({}),
  dispatch => ({ updateFormularState: dispatcherFunc => ev => dispatch(dispatcherFunc(ev)) }),
)(controller as any);

function mapStateToProps(state) {
	return {
		formular: state.formular,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		cleanFormularState: viewName => dispatch(cleanStateAction(viewName)),
		setInitialState: (viewName, initialState) => dispatch(dispatchInitialState(viewName, initialState)),
	};
}

function componentDidMountFunctional(props: IProps & IStateRedux) {
	if (!props.formular) {
		throw Error("FormularReducer must be to the project's first level state");
	}
	cleanState(props);
	setInitialState(props);
}

function cleanState(props) {
	R.pathOr(null, ['data', props.model], props.formular) ? props.cleanFormularState(props.model) : null;
}

function setInitialState(props) {
	R.not(isEmptyOrNil(props.initialState)) && props.setInitialState(props.model, props.initialState);
}

export {
  FormularProvider,
  formularReducer,
  IFormularState,
  Controller,
  validations,
};
