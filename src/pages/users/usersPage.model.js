import {combine, declareAction, declareAtom} from "@reatom/core";
import { useEffect} from 'react'
import axios from 'axios'
import {useAction, useAtom} from "@reatom/react";

const loadUsersSuccess = declareAction();
export const loadUsersActions = declareAction(async (_, { dispatch }) => {
  const { data } = await axios.get('http://jsonplaceholder.typicode.com/users?_start=0&_limit=5');
  dispatch(loadUsersSuccess(data))
});

const isLoading = declareAtom(['user list loading'], false, on => [
  on(loadUsersActions, () => true),
  on(loadUsersSuccess, () => false),
]);

const usersList = declareAtom(['user list'], [], on => [
  on(loadUsersActions,  () => []),
  on(loadUsersSuccess, (state, payload) => payload),
]);

export const usersPageAtom = combine(['usersPageAtom'], {
  isLoading,
  usersList
});

export function useUsers(){
  const loadUsers = useAction(loadUsersActions, []);
  const data = useAtom(usersPageAtom);

  useEffect(() => {
    if(data.usersList.length === 0) {
      loadUsers();
    }
  }, []);

  return data
}
