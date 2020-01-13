import { declareAction } from '@reatom/core';

export function declareAsyncAction(name, fetcher) {
  const done = declareAction([`${name} fetch done`]);
  const fail = declareAction([`${name} fetch fail`]);

  const fetchAction = declareAction(
    [`${name} fetch`],
    async (variables, store) => {
      try {
        const data = await fetcher(variables, store);
        store.dispatch(done(data));
        return data;
      } catch (error) {
        console.error('error', error);
        store.dispatch(fail(error));
      }
    },
  );

  fetchAction.done = done;
  fetchAction.fail = fail;

  return fetchAction;
}
