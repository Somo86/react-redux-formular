import * as React from 'react';
import {Context} from 'react';

//** It Produces similar behaviour as React Context
//** additionally it allows to be used in older React versions

export default function createContext<T>(defaultValue: Object = {}): Context<T> {

  let state = defaultValue ;

  function ConsumerComponent(props): JSX.Element {
    const newProps = {...props, ...state};
    return (
      <div>
        { props.children(newProps) }
      </div>
    )
  }

  function ProviderComponent(props): JSX.Element {
    state = props.value;
    return (
      <div>
        { props.children }
      </div>
    );
  }

  return {
    Provider: ProviderComponent,
    Consumer: ConsumerComponent,
  }
}
