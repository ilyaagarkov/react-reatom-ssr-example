/**
 * Adds the possibility of dispatching and waiting the _actionFetch_
 * @param store
 * @param action
 * @example
 * const result = await call(store, actionFetch())
 */
export function call(
  store,
  action,
) {
  let res;
  let rej;

  store.dispatch({
    ...action,
    reactions: [
      async (...a) => {
        try {
          const payload = await action.reactions[0](...a);
          res(payload)
        } catch (error) {
          rej(error)
        }
      }
    ],
  });

  return new Promise((_res, _rej) => {
    res = _res;
    rej = _rej;
  })
}
