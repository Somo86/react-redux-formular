import * as React from 'react';
import * as renderer from 'react-test-renderer';
import createContext from './createContext';

describe('create context component', () => {
  const ContextComponent = createContext({});
  const providerComponent = renderer.create(
    <ContextComponent.Provider value={{state: 'test'}}>
      <div>
        <input />
      </div>
    </ContextComponent.Provider>
  );

  /*const consumerComponent = renderer.create(
    <ContextComponent.Consumer>
      {(context) => (
        <p>test</p>
      )}
    </ContextComponent.Consumer>
  );*/

  test('should return a Provider nd a Consumer', () => {
    expect(Object.keys(ContextComponent)).toContain('Provider');
    expect(Object.keys(ContextComponent)).toContain('Consumer');
  });

  test('',() => {
    expect(providerComponent.toJSON()).toMatchSnapshot();
  })
});