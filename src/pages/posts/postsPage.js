import React from 'react';
import {usePosts, loadPostsActions, postsPageAtom} from "./postsPage.model"
import {BasePageTemplate} from "../../ui/templates/basePageTemlate";

export default function PostsPage() {
  const {postsList} = usePosts();

  return (
    <BasePageTemplate>
      {postsList.map(post => <div key={post.id}>{post.title}</div>)}
    </BasePageTemplate>
  );
}

PostsPage.model = postsPageAtom;
PostsPage.getInitialData = dispatch => dispatch(loadPostsActions());
