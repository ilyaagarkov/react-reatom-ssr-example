import {combine, declareAction, declareAtom} from "@reatom/core";
import { useEffect} from 'react'
import axios from 'axios'
import {useAction, useAtom} from "@reatom/react";

const loadPostsSuccess = declareAction();
export const loadPostsActions = declareAction(async (_, { dispatch }) => {
  const { data } = await axios.get('http://jsonplaceholder.typicode.com/posts?_start=0&_limit=5');
  dispatch(loadPostsSuccess(data))
});

const isLoading = declareAtom(['posts list loading'], false, on => [
  on(loadPostsActions, () => true),
  on(loadPostsSuccess, () => false),
]);

const postsList = declareAtom(['posts list'], [], on => [
  on(loadPostsActions,  () => []),
  on(loadPostsSuccess, (state, payload) => payload),
]);

export const postsPageAtom = combine(['postsPageAtom'], {
  isLoading,
  postsList
});

export function usePosts(){
  const loadPosts = useAction(loadPostsActions, []);
  const data = useAtom(postsPageAtom);

  useEffect(() => {
    if (data.postsList.length === 0) {
      loadPosts();
    }

  }, []);

  return data;
}
