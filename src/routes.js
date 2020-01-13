import loadable from '@loadable/component';

const UsersPage = loadable(() =>
  import(/* webpackChunkName: "UsersPage" */ './pages/users/usersPage'),
);
const PostPage = loadable(() =>
  import(/* webpackChunkName: "PostPage" */ './pages/posts/postsPage'),
);

export const routes = [
  {
    path: '/',
    exact: true,
    component: UsersPage,
  },
  {
    path: '/users',
    exact: true,
    component: UsersPage,
  },
  {
    path: '/posts',
    exact: true,
    component: PostPage,
  },
];
