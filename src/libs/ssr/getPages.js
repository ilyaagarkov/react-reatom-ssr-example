export function getPages(branch) {
  return Promise.all(
    branch.map(async ({ route, match }) => {
      const component = await getComponentFromFromRoute(route);
      return [component, match];
    }),
  );
}

async function getComponentFromFromRoute(route) {
  if (typeof route.component.load !== 'function') {
    return route.component;
  }
  // loadable component
  const data = await route.component.load();
  if (!data.default) return data;
  return data.default;
}
