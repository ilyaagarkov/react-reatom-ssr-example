import { call } from 'libs/reatom-toolkit';

export async function preloadData(pages, store) {
  await Promise.all(
    pages.map(async ([component, match]) => {
      if (component.model) {
        store.subscribe(component.model, () => {});
      }
      if (component.getInitialData) {
        await component.getInitialData(call.bind(null, store), match);
      }
    }),
  );
}
