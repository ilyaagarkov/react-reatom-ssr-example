import loadable from "@loadable/component";


const UsersPage = loadable(() => import('./pages/users/usersPage'));
const PostPage = loadable(() => import('./pages/posts/postsPage'));


export const routes = [
  {
    path: '/',
    exact: true,
    component: UsersPage
  },
  {
    path: '/users',
    exact: true,
    component: UsersPage
  },
  {
    path: '/posts',
    exact: true,
    component: PostPage
  },
];
