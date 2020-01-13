import React from 'react';
import { createStore } from '@reatom/core';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import { matchRoutes } from 'react-router-config';

import { renderMetaTags } from './renderMetaTags';
import { getPages } from './getPages';

HelmetProvider.canUseDOM = false;

const pageWithStaticTags = {
  renderMetaTags(url) {
    return (
      <Helmet>
        <title>Page Title</title>
        <meta name="description" content="description" />
        <meta property="og:image" content="//imageUrl" />
        <meta property="og:url" content={url} />
      </Helmet>
    );
  },
};

const nestedPageWithStaticTags = {
  renderMetaTags() {
    return (
      <Helmet>
        <title>Nested Title</title>
        <meta name="description" content="nested description" />
      </Helmet>
    );
  },
};

const projectPage = {
  async renderMetaTags(url, storeReadyPromise) {
    const store = await storeReadyPromise;
    const { project } = store.getState();

    return (
      <Helmet>
        <title>{project.title}</title>
        <meta name="description" content={project.description} />
      </Helmet>
    );
  },
};

const jobPage = {
  async renderMetaTags(url, storeReadyPromise) {
    const store = await storeReadyPromise;
    const { project } = store.getState();

    return (
      <Helmet>
        <title>{project.title} | Jobs</title>
      </Helmet>
    );
  },
};

function normalizeString(string) {
  return string.replace(/[\n] /g, '').replace(/ /g, '');
}

let appStore;
beforeEach(() => {
  appStore = createStore({
    project: {
      title: 'Test Project',
      description: 'desc',
    },
  });
});

describe('ssr render meta tags for pages', () => {
  it('should render static tags', async done => {
    const pages = [[pageWithStaticTags]];

    const tags = await renderMetaTags(
      pages,
      '/some_url',
      Promise.resolve(null),
    );

    expect(normalizeString(tags)).toBe(
      normalizeString(`
        <title data-rh="true">Page Title</title>
        <meta data-rh="true" name="description" content="description"/>
        <meta data-rh="true" property="og:image" content="//imageUrl"/>
        <meta data-rh="true" property="og:url" content="/some_url"/>
    `),
    );
    done();
  });

  it('should work for static nested pages', async done => {
    const routes = [
      {
        path: '/route',
        component: pageWithStaticTags,
        routes: [
          {
            path: '/route/nested',
            component: nestedPageWithStaticTags,
          },
        ],
      },
    ];
    const branch = matchRoutes(routes, '/route/nested');
    const pages = await getPages(branch);

    const tags = await renderMetaTags(
      pages,
      '/some_url',
      Promise.resolve(null),
    );

    expect(normalizeString(tags)).toBe(
      normalizeString(`
        <title data-rh="true">Nested Title</title>
        <meta data-rh="true" property="og:image" content="//imageUrl"/>
        <meta data-rh="true" property="og:url" content="/some_url"/>
        <meta data-rh="true" name="description" content="nested description"/>
    `),
    );
    done();
  });

  it('should work with meta tags depended on async data', async done => {
    const tags = await renderMetaTags(
      [[projectPage]],
      '/some_url',
      Promise.resolve(appStore),
    );

    expect(normalizeString(tags)).toBe(
      normalizeString(`
        <title data-rh="true">Test Project</title>
        <meta data-rh="true" name="description" content="desc"/>
    `),
    );

    done();
  });

  it('should wotk with nested routes and async data', async done => {
    const routes = [
      {
        path: '/project',
        component: projectPage,
        routes: [
          {
            path: '/project/jobs',
            component: jobPage,
          },
        ],
      },
    ];
    const branch = matchRoutes(routes, '/project/jobs');
    const pages = await getPages(branch);

    const tags = await renderMetaTags(
      pages,
      '/some_url',
      Promise.resolve(appStore),
    );

    expect(normalizeString(tags)).toBe(
      normalizeString(`
        <title data-rh="true">Test Project | Jobs</title>
        <meta data-rh="true" name="description" content="desc"/>
    `),
    );

    done();
  });
});
