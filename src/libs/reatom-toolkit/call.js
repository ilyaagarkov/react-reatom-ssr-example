// return a promise from store.dispatch
export function call(store, action) {
  let res;
  let rej;

  store.dispatch({
    ...action,
    reactions: [
      async (...a) => {
        try {
          const payload = await action.reactions[0](...a);
          res(payload);
        } catch (error) {
          rej(error);
        }
      },
    ],
  });

  return new Promise((_res, _rej) => {
    res = _res;
    rej = _rej;
  });
}
