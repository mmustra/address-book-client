import * as _ from 'lodash';
import { NzMessageService } from 'ng-zorro-antd';
import * as randomMaterialColor from 'random-material-color';
import { Observable, of, Subject } from 'rxjs';
import { filter, finalize, flatMap, takeUntil, tap } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Permission } from '../../../../../shared/enums/permission.enum';
import { Role } from '../../../../../shared/enums/role.enum';
import { IAvatar } from '../../../../../shared/interfaces/avatar.interface';
import { IUser } from '../../interfaces/user.interface';
import { IUsersQuery } from '../../interfaces/users-query.interface';
import { ProfileService } from '../../modules/profile/services/profile.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.less']
})
export class AllUsersComponent implements OnInit, OnDestroy {
  Permission = Permission;
  destroy$: Subject<void>;
  profile: IUser;
  query: IUsersQuery;
  users: IUser[];
  avatarsMap: Map<string, IAvatar>;
  selectedRoleMap: Map<string, Role>;
  actionsLoadingSet: Set<string>;
  isLoading: boolean;
  textSearch: string;
  paginationLimitOptions: number[];
  roles: Role[];

  constructor(
    private usersService: UsersService,
    private profileService: ProfileService,
    private messageService: NzMessageService
  ) {
    this.destroy$ = new Subject();
    this.query = {};
    this.avatarsMap = new Map();
    this.selectedRoleMap = new Map();
    this.actionsLoadingSet = new Set();
    this.paginationLimitOptions = [12, 45, 99];
    this.roles = [Role.Moderator, Role.User];
  }

  ngOnInit(): void {
    this.profile = this.profileService.profile;

    this.usersService.query$
      .pipe(
        takeUntil(this.destroy$),
        filter(n => !_.isNil(n))
      )
      .subscribe(query => {
        this.query = query;
        this.textSearch = this.query.textSearch;
      });

    this.usersService.users$
      .pipe(
        takeUntil(this.destroy$),
        filter(n => !_.isNil(n))
      )
      .subscribe(users => {
        this.setAvatars(users);
        this.setRoles(users);

        const cachedQuery = this.usersService.query;

        if (!users.length && cachedQuery && cachedQuery.page > 1) {
          const newQuery = { ...cachedQuery };
          newQuery.page = cachedQuery.page - 1;
          this.getUsers$(newQuery).subscribe();
        }

        this.users = users;
      });

    const cachedUsers = this.usersService.users;
    if (!cachedUsers.length) {
      this.getUsers$({ limit: this.paginationLimitOptions[0] }).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deleteUser(user: IUser): void {
    this.actionsLoadingSet.add(user.id);
    this.usersService
      .deleteUser$(user.id)
      .pipe(finalize(() => this.actionsLoadingSet.delete(user.id)))
      .subscribe(() => {
        this.messageService.create('success', `User ${user.fullName} deleted.`);
      });
  }

  changeRole(user: IUser, role: Role): void {
    const currentRole = user.roles[0];
    this.actionsLoadingSet.add(user.id);
    this.usersService
      .updateUser$(user.id, { roles: [role] })
      .pipe(finalize(() => this.actionsLoadingSet.delete(user.id)))
      .subscribe(
        () => {
          this.messageService.create(
            'success',
            `User ${user.fullName} role changed.`
          );
        },
        error => {
          if (error.statusCode === 405) {
            this.selectedRoleMap.set(user.id, currentRole);
          }
        }
      );
  }

  changePageNumber(page): void {
    if (this.isLoading) {
      return;
    }
    this.getUsers$({ page, textSearch: this.textSearch }).subscribe();
  }

  changePageSize(limit): void {
    this.getUsers$({
      page: 1,
      limit,
      textSearch: this.textSearch
    }).subscribe();
  }

  searchText(text): void {
    this.textSearch = text;
    this.getUsers$({ textSearch: text }).subscribe();
  }

  private setAvatars(users: IUser[]): void {
    _.forEach(users, user => {
      const text = `${_.get(user, 'firstName[0]', '')}${_.get(
        user,
        'lastName[0]',
        ''
      )}`.toUpperCase();
      this.avatarsMap.set(user.id, {
        text,
        color: randomMaterialColor.getColor({
          text
        }),
        src: user.avatarUrl
      });
    });
  }

  private setRoles(users: IUser[]): void {
    _.forEach(users, user => this.selectedRoleMap.set(user.id, user.roles[0]));
  }

  private getUsers$(options?: Partial<IUsersQuery>): Observable<IUser[]> {
    const { totalPages, ...payload } = this.query;
    return of({}).pipe(
      tap(() => (this.isLoading = true)),
      flatMap(() =>
        this.usersService.getUsers$(_.assign({}, payload, options))
      ),
      finalize(() => (this.isLoading = false))
    );
  }
}
