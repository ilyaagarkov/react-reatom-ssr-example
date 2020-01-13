import { matchRoutes } from 'react-router-config';
import loadable from '@loadable/component';

import { getPages } from './getPages';

const Page1 = () => null;
const Page2 = () => null;
const Page3 = () => null;
const lazyPage3 = loadable(() => Page3);

describe('ssr - get pages for render by url', () => {
  it('should work for flat routes', async done => {
    const routes = [
      {
        path: '/page1',
        component: Page1,
      },
      {
        path: '/page2',
        component: Page2,
      },
      {
        path: '/page3',
        component: Page3,
      },
    ];

    const branch1 = matchRoutes(routes, '/page1');
    const pages1 = await getPages(branch1);
    expect(pages1.map(([c]) => c)).toEqual([Page1]);

    const branch2 = matchRoutes(routes, '/page2');
    const pages2 = await getPages(branch2);
    expect(pages2.map(([c]) => c)).toEqual([Page2]);

    const branch3 = matchRoutes(routes, '/page3');
    const pages3 = await getPages(branch3);
    expect(pages3.map(([c]) => c)).toEqual([Page3]);

    done();
  });

  it('should work with lazy components', async done => {
    const routes = [
      {
        path: '/page3',
        component: lazyPage3,
      },
    ];
    const branch = matchRoutes(routes, '/page3');
    const pages = await getPages(branch);
    expect(pages.map(([c]) => c)).toEqual([Page3]);

    done();
  });

  it('should work with nested routes', async done => {
    const routes = [
      {
        path: '/page',
        component: Page1,
        routes: [{ path: '/page/nested', component: lazyPage3 }],
      },
    ];

    const branch = matchRoutes(routes, '/page/nested');
    const pages = await getPages(branch);
    expect(pages.map(([c]) => c)).toEqual([Page1, Page3]);

    done();
  });
});
