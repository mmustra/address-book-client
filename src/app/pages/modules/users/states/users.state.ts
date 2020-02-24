import * as _ from 'lodash';

import { ImmutableContext } from '@ngxs-labs/immer-adapter';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { AuthAction } from '../../../../auth/states/auth.actions';
import { IUser } from '../interfaces/user.interface';
import { IUsersQuery } from '../interfaces/users-query.interface';
import { UsersAction } from './users.actions';

export class UsersStateModel {
  users: IUser[];
  query: IUsersQuery;
}

const usersInitialState: UsersStateModel = {
  users: [],
  query: null
};

@State<UsersStateModel>({
  name: 'users',
  defaults: usersInitialState
})
export class UsersState {
  @Selector()
  static users(state: UsersStateModel): IUser[] {
    return state.users;
  }

  @Selector()
  static query(state: UsersStateModel): IUsersQuery {
    return state.query;
  }

  @Action(UsersAction.SetUsers)
  @ImmutableContext()
  setUsers(
    { setState }: StateContext<UsersStateModel>,
    { users, query }: UsersAction.SetUsers
  ): void {
    setState((draft: UsersStateModel) => {
      draft.users = users;
      draft.query = query;

      return draft;
    });
  }

  @Action(UsersAction.RemoveUsers)
  @ImmutableContext()
  removeUsers({ setState }: StateContext<UsersStateModel>): void {
    setState((draft: UsersStateModel) => {
      draft = usersInitialState;

      return draft;
    });
  }

  @Action(UsersAction.UpdateUser)
  @ImmutableContext()
  updateUser(
    { setState }: StateContext<UsersStateModel>,
    { user }: UsersAction.UpdateUser
  ): void {
    setState((draft: UsersStateModel) => {
      const oldUserIndex = _.findIndex(draft.users, { id: user.id });

      if (oldUserIndex >= 0) {
        draft.users.splice(oldUserIndex, 1, user);
      }

      return draft;
    });
  }

  @Action(UsersAction.RemoveUser)
  @ImmutableContext()
  removeUser(
    { setState }: StateContext<UsersStateModel>,
    { userId }: UsersAction.RemoveUser
  ): void {
    setState((draft: UsersStateModel) => {
      _.remove(draft.users, { id: userId });

      return draft;
    });
  }

  @Action(AuthAction.Logout)
  @ImmutableContext()
  clearAll({ setState }: StateContext<UsersStateModel>): void {
    setState(() => usersInitialState);
  }
}
