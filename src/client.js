import App from './App';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import { hydrate } from 'react-dom';
import {createStore} from "@reatom/core";
import { context } from "@reatom/react";
import { connectReduxDevtools } from '@reatom/debug'

const store = createStore(window.__INITIAL_STATE__);

connectReduxDevtools(store)

hydrate(

    <BrowserRouter>
      <context.Provider value={store}>
        <App />
      </context.Provider>
    </BrowserRouter>
,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
