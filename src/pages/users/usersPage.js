import React from 'react';
import {useUsers} from "./usersPage.model";
import {usersPageAtom, loadUsersActions} from "./usersPage.model";
import {BasePageTemplate} from "../../ui/templates/basePageTemlate";

export default function UsersPage() {
  const users = useUsers();
  return (
    <BasePageTemplate>
      {users.usersList.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </BasePageTemplate>
  );
}

UsersPage.model = usersPageAtom;
UsersPage.getInitialData = dispatch => dispatch(loadUsersActions());

