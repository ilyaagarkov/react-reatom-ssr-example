import App from './App';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server'
import { matchRoutes } from "react-router-config";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

import stats from '../build/public/stats.json'
import {createStore} from "@reatom/core";
import { Provider } from "@reatom/react";
import {routes} from "./routes";
import {call} from "./libs/@reatom/ssr";

const extractor = new ChunkExtractor({ stats, entrypoints: ['client'] })

async function renderApp(url) {
  const context = {};

  const branch = matchRoutes(routes, url);

  const store = createStore();
  await Promise.all(branch.map(async ({ route, match }) => {
    const { component } = route;

    let pageComponent = component;
    const isLazyComponent = typeof component.load === 'function';
    if(isLazyComponent) {
      const lazy = await component.load();
      pageComponent = lazy.default
    }

    console.log('pageComponent.getInitialData', pageComponent.getInitialData)
    if (pageComponent.model) {
      store.subscribe(pageComponent.model, () => {});
    }
    if(pageComponent.getInitialData) {
      await pageComponent.getInitialData(call.bind(null, store));
    }
  }));

  const markup = renderToString(
      <ChunkExtractorManager extractor={extractor}>
          <StaticRouter context={context} location={url}>
            <Provider value={store}>
              <App />
            </Provider>
          </StaticRouter>
      </ChunkExtractorManager>
  );

  const scriptTags = extractor.getScriptTags();
  return { context, markup, scriptTags, initialState: store.getState()}

}



const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {

    const  { context, markup, scriptTags, initialState } = await renderApp(req.url);

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(
        `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ''
        }
        ${
          process.env.NODE_ENV === 'production'
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
    </head>
    <body>
        <div id="root">${markup}</div>
        <script>
            __INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        ${scriptTags}
    </body>
</html>`
      );
    }
  });

export default server;
