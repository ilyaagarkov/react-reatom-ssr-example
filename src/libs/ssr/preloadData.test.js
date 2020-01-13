import { declareAsyncAction } from 'libs/reatom-toolkit';
import { createStore, declareAtom } from '@reatom/core';

import { preloadData } from './preloadData';

// *** Page 1 **** //
const page1State = {
  data: 'page1State',
};

const page1InitialAction = declareAsyncAction(
  'page1InitialAction',
  async () => page1State,
);
function Page1() {
  return null;
}

Page1.model = declareAtom(['Page1Atom'], null, on => [
  on(page1InitialAction.done, (_, payload) => payload),
]);

Page1.getInitialData = dispatch => dispatch(page1InitialAction());
// *** Page 1 **** //

// *** Page 2 **** //
function Page2() {
  return null;
}

const page2State = {
  someField: 'page2',
};
const page2InitialAction = declareAsyncAction(
  'page2InitialAction',
  () => page2State,
);

Page2.model = declareAtom(['Page2Atom'], null, on => [
  on(page2InitialAction.done, (_, payload) => payload),
]);

Page2.getInitialData = dispatch => dispatch(page2InitialAction());
// *** Page 2 **** //

let store;
describe('ssr preload data for pages', () => {
  beforeEach(() => {
    store = createStore();
  });

  it('should fill store for first page', async done => {
    const pages = [[Page1, {}]];

    await preloadData(pages, store);
    expect(store.getState()).toEqual({
      Page1Atom: page1State,
    });
    done();
  });

  it('should fill store for second page', async done => {
    const pages = [[Page2, {}]];

    await preloadData(pages, store);

    expect(store.getState()).toEqual({
      Page2Atom: page2State,
    });
    done();
  });

  it('should fill store for both pages', async done => {
    const pages = [
      [Page1, {}],
      [Page2, {}],
    ];
    await preloadData(pages, store);
    expect(store.getState()).toEqual({
      Page1Atom: page1State,
      Page2Atom: page2State,
    });
    done();
  });

  it('should work for page without getInitialData and  model', async done => {
    const pages = [[() => {}]];
    await preloadData(pages, store);
    done();
  });
});
