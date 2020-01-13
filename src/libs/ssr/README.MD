# Server Side Rendering Utils

Server side rendering based on
* [react-router-config](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config)
* [reatom](https://github.com/artalar/reatom)
* [loadable-component](https://github.com/gregberge/loadable-components)

## Setup Routing

Create router config

```javascript

 const routes = [{
    path: '/',
    component: HomePage
 }, {
    path: '/projects/:projectId',
    component: projectPage
 }]
```

All pages for routes should be created by `createPage` function
```javascript
import { Helmet } from 'react-helmet-async'

import { createPage } from 'libs/ssr';
import { MyPageModel, getProjectPageData } from './projectPage.model'

function ProjectPage() {
  return <div>My Page</div>
}    

export default createPage(ProjectPage, {
  model: MyPageModel,
  getInitialData: (dispatch, routerMatch) => dispatch(getProjectPageData(routerMatch.params.projectId)),
  renderMetaTags: async (pageUrl, storeReadyPromise) => {
    const store = await storeReadyPromise;
    const { project } = store.getState(MyPageModel)
    return (
      <Helmet>
         <title>{project.title}</title>
      </Helmet>
    )
  }
}) 
```

create page config: 

* **model**(optional) - atom (from reatom) with data for your page
* **getInitialData**(optional) - a function should return a promise resolving when store filled by data. it gets two parameters 
    * dispatch - wrapped dispatch from `reatom` store. Return a promise for async action
    * routerMatch - match route object
* **renderMetaTags** a function return `jsx` or promise resolved with `jsx` value. It gets two parameters
    * pageUrl - string with current url
    * promise resolved on store fill data(It should be ignore for page with static meta tags)
    


