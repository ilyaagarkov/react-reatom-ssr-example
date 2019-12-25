import React from 'react';
import {NavLink} from "react-router-dom";

export function BasePageTemplate(props) {
  return (
    <div>
      <header>
        <ul>
          <li>
            <NavLink to="/users" exact>Users</NavLink>
          </li>
          <li>
            <NavLink to="/posts" exact>Posts</NavLink>
          </li>
        </ul>
      </header>
      <div>
        {props.children}
      </div>
    </div>
  );
};
