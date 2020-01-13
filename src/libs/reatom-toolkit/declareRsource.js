import { declareAtom } from '@reatom/core';

import { declareAsyncAction } from './declareAsyncAction';

export function declareResource(
  name,
  initialState,
  fetcher,
  dependencyMatcher,
) {
  const asyncAction = declareAsyncAction(name, fetcher);

  const resource = declareAtom(name, initialState, on => [
    on(asyncAction.done, (_, payload) => payload),
    ...dependencyMatcher(on),
  ]);

  resource.isLoading = declareAtom([`${name} is loading`], false, on => [
    on(asyncAction, () => true),
    on(asyncAction.fail, () => false),
    on(asyncAction.done, () => false),
  ]);

  resource.get = asyncAction;

  return resource;
}
