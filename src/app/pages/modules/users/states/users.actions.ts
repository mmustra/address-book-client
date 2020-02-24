/* tslint:disable:no-namespace */
import { IUser } from '../interfaces/user.interface';
import { IUsersQuery } from '../interfaces/users-query.interface';

export namespace UsersAction {
  export class SetUsers {
    static readonly type = '[Users] Set Users';
    constructor(public users: IUser[], public query?: IUsersQuery) {}
  }

  export class RemoveUsers {
    static readonly type = '[Users] Remove Users';
  }

  export class UpdateUser {
    static readonly type = '[Users] Update User';
    constructor(public user: IUser) {}
  }

  export class RemoveUser {
    static readonly type = '[Users] Remove User';
    constructor(public userId: string) {}
  }
}
