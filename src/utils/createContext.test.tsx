import * as React from 'react';
import * as renderer from 'react-test-renderer';
import createContext from './createContext';

describe('create context component', () => {
  let testContext;
  const contextProps = {state: 'test'};
  const ContextComponent = createContext({});
  const providerComponent = renderer.create(
    <ContextComponent.Provider value={contextProps}>
      <div>
        <input />
      </div>
    </ContextComponent.Provider>
  );

  const consumerComponent = renderer.create(
    <ContextComponent.Consumer>
      {(context) => {
        testContext = context;
        return <p>test</p>
      }}
    </ContextComponent.Consumer>
  );

  test('should return a Provider nd a Consumer', () => {
    expect(Object.keys(ContextComponent)).toContain('Provider');
    expect(Object.keys(ContextComponent)).toContain('Consumer');
  });

  test('consumer and provider should render', () => {
    expect(providerComponent.toJSON()).toMatchSnapshot();
    expect(consumerComponent.toJSON()).toMatchSnapshot();
  });

  test('should Provider consumer pass props to consumer', () => {
    expect(testContext).toMatchObject(contextProps);
  });
});