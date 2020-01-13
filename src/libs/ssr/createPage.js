export function createPage(component, config = {}) {
  const page = component;
  page.getInitialData = config.getInitialData;
  page.model = config.model;
  page.renderMetaTags = config.renderMetaTags;

  return page;
}
