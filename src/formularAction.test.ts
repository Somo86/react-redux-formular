import * as React from 'react';
import {
  cleanState,
  dispatchUpdateAction,
  dispatchErrorAction,
  dispatchInitialState,
  CLEAN_FORMULAR_STATE,
  UPDATE_FORM_DATA_TO_REDUCER,
  FORM_DATA_ERROR,
  SET_INITIAL_STATE,
} from './formularAction';

describe('test actions dispatcher', () => {
  const viewName = 'testView';
  const event = {
    currentTarget: {
      value: '',
    }
  } as React.ChangeEvent<HTMLInputElement>;

  const errorList = [{errorMsg: {name: 'test error'}, isValid: true}];

  test('should dispatch Clean action', () => {
    const cleanDispatched = cleanState(viewName);
    expect(cleanDispatched.type).toBe(CLEAN_FORMULAR_STATE);
  });

  test('should dispatch update action', () => {
    const updateDispatched = dispatchUpdateAction(viewName, event);
    expect(updateDispatched.type).toBe(UPDATE_FORM_DATA_TO_REDUCER);
  });

  test('should dispatch error action', () => {
    const updateDispatched = dispatchErrorAction(viewName, errorList);
    expect(updateDispatched.type).toBe(FORM_DATA_ERROR);
  });

  test('should dispatch initial state', () => {
    const updateDispatched = dispatchInitialState(viewName, errorList);
    expect(updateDispatched.type).toBe(SET_INITIAL_STATE);
  });
});