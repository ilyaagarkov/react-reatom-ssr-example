import * as path from 'path';

import React from 'react';
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import { matchRoutes } from 'react-router-config';
import { createStore } from '@reatom/core';
import { Provider } from '@reatom/react';

import {
  renderApp,
  getPages,
  preloadData,
  renderMetaTags,
} from 'libs/ssr/server.js';

import { routes } from './routes';
import App from './App';

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', async (req, res) => {
    const context = {};
    const {
      content,
      initialState,
      metaTags,
      stylesTags,
      scriptTags,
    } = await getPageData({
      currentUser: req.currentUser,
      url: req.url,
      pfgApi: req.pfgApi,
      context,
    });

    if (!context.url) {
      res.status(200);
      const app = renderApp`
          <!doctype html>
          <html lang="en">
            <head>
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta charset="utf-8" />
              <title>Welcome to Razzle</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              ${metaTags}
              ${stylesTags}
            </head>
            <body>
              <div id="root">${content}</div>
              <script>window.__INITIAL_STATE__ = ${initialState}</script>
           ${scriptTags}
            </body>
          </html>     
      `;
      app.pipe(res, { end: true });
    } else {
      res.redirect(context.url);
    }
  });

export default server;

async function getPageData({ url, fullUrl, context }) {
  const statsFile = path.resolve('build/public/stats.json');
  const extractor = new ChunkExtractor({ statsFile, entrypoints: ['client'] });

  const branch = matchRoutes(routes, url);
  const pages = await getPages(branch);

  const storeWithDataPromise = new Promise(async resolve => {
    const store = createStore();
    await preloadData(pages, store);
    resolve(store);
  });

  const metaTags = renderMetaTags(pages, storeWithDataPromise, fullUrl);

  const contentPromise = storeWithDataPromise
    .then(store =>
      renderToString(
        <ChunkExtractorManager extractor={extractor}>
          <StaticRouter context={context} location={url}>
            <Provider value={store}>
              <App />
            </Provider>
          </StaticRouter>
        </ChunkExtractorManager>,
      ),
    )
    .catch(
      () =>
        // TODO render some error layout
        'error',
    );

  const initialState = storeWithDataPromise.then(store =>
    JSON.stringify(store.getState()),
  );

  const scriptTags = contentPromise.then(() => extractor.getScriptTags());
  const stylesTags = contentPromise.then(() => extractor.getStyleTags());

  return {
    content: contentPromise,
    initialState,
    metaTags,
    stylesTags,
    scriptTags,
  };
}
