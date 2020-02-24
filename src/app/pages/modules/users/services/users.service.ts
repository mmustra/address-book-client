import { forkJoin, Observable, of } from 'rxjs';
import { flatMap, map, withLatestFrom } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';

import { IUserPayload } from '../interfaces/user-payload.interface';
import { IUser } from '../interfaces/user.interface';
import { IUsersQuery } from '../interfaces/users-query.interface';
import { UsersAction } from '../states/users.actions';
import { UsersState } from '../states/users.state';
import { UsersApiService } from './users.api.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private store: Store, private usersApiService: UsersApiService) {}

  @Select(UsersState.users)
  users$: Observable<IUser[]>;

  @Select(UsersState.query)
  query$: Observable<IUsersQuery>;

  get users(): IUser[] {
    return this.store.selectSnapshot(UsersState.users);
  }

  get query(): IUsersQuery {
    return this.store.selectSnapshot(UsersState.query);
  }

  getUsers$(
    options: Omit<IUsersQuery, 'totalPages'> = {}
  ): Observable<IUser[]> {
    return this.usersApiService.getUsers$(options).pipe(
      flatMap(usersData => {
        const { docs: users, page, limit, totalPages } = usersData;
        return this.store.dispatch(
          new UsersAction.SetUsers(users, {
            page,
            limit,
            totalPages,
            textSearch: options.textSearch
          })
        );
      }),
      withLatestFrom(this.users$),
      map(results => results.pop())
    );
  }

  updateUser$(
    userId: string,
    payload: Partial<IUserPayload>
  ): Observable<IUser> {
    return this.usersApiService.updateUser$(userId, payload).pipe(
      flatMap(user =>
        forkJoin(
          of(user),
          this.store.dispatch(new UsersAction.UpdateUser(user))
        )
      ),
      withLatestFrom(this.users$),
      map(results => results[0][0])
    );
  }

  deleteUser$(userId: string): Observable<IUser> {
    return this.usersApiService.deleteUser$(userId).pipe(
      flatMap(() => this.store.dispatch(new UsersAction.RemoveUser(userId))),
      withLatestFrom(this.users$),
      map(results => results.pop())
    );
  }
}
