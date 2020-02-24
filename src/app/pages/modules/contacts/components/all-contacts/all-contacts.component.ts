import * as _ from 'lodash';
import { simpleEmptyImage } from 'ng-zorro-antd';
import * as randomMaterialColor from 'random-material-color';
import { Observable, of, Subject } from 'rxjs';
import { filter, finalize, flatMap, takeUntil, tap } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Permission } from '../../../../../shared/enums/permission.enum';
import { IAvatar } from '../../../../../shared/interfaces/avatar.interface';
import { PermissionService } from '../../../../../shared/services/permisssion.service';
import { IUser } from '../../../users/interfaces/user.interface';
import { ProfileService } from '../../../users/modules/profile/services/profile.service';
import { IContact } from '../../interfaces/contact.interface';
import { IContactsQuery } from '../../interfaces/contacts-query.interface';
import { ContactsService } from '../../services/contacts.service';

@Component({
  selector: 'app-all-contacts',
  templateUrl: './all-contacts.component.html',
  styleUrls: ['./all-contacts.component.less']
})
export class AllContactsComponent implements OnInit, OnDestroy {
  Permission = Permission;
  destroy$: Subject<void>;
  profile: IUser;
  query: IContactsQuery;
  contacts: IContact[];
  avatarsMap: Map<string, IAvatar>;
  actionsLoadingSet: Set<string>;
  isLoading: boolean;
  allContactsOption: boolean;
  canDeleteContact: boolean;
  textSearch: string;
  paginationLimitOptions: number[];
  simpleEmptyImage = simpleEmptyImage;

  constructor(
    private router: Router,
    private profileService: ProfileService,
    public contactsService: ContactsService,
    public permissionService: PermissionService
  ) {
    this.destroy$ = new Subject();
    this.query = {};
    this.avatarsMap = new Map();
    this.actionsLoadingSet = new Set();
    this.paginationLimitOptions = [12, 45, 99];
  }

  ngOnInit(): void {
    this.profile = this.profileService.profile;

    this.contactsService.query$
      .pipe(
        takeUntil(this.destroy$),
        filter(n => !_.isNil(n))
      )
      .subscribe(query => {
        this.query = query;
        this.textSearch = this.query.textSearch;
        this.allContactsOption = this.query.any;
      });

    this.contactsService.contacts$
      .pipe(
        takeUntil(this.destroy$),
        filter(n => !_.isNil(n))
      )
      .subscribe(contacts => {
        this.permissionService
          .hasPermission$(Permission.ContactsDeleteContactOption)
          .subscribe(isPermitted => (this.canDeleteContact = isPermitted));

        this.setAvatars(contacts);

        const cachedQuery = this.contactsService.query;

        if (!contacts.length && cachedQuery && cachedQuery.page > 1) {
          const newQuery = { ...cachedQuery };
          newQuery.page = cachedQuery.page - 1;
          this.getContacts$(newQuery).subscribe();
        }

        this.contacts = contacts;
      });

    const cachedContacts = this.contactsService.contacts;
    if (!cachedContacts.length) {
      this.getContacts$({ limit: this.paginationLimitOptions[0] }).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  deleteContact(contact): void {
    if (this.profile.id !== contact.userId && !this.canDeleteContact) {
      return;
    }

    this.actionsLoadingSet.add(contact.id);

    this.contactsService
      .deleteContact$(contact.id)
      .pipe(finalize(() => this.actionsLoadingSet.delete(contact.id)))
      .subscribe();
  }

  editContact(contact): void {
    this.router.navigate(['/contacts', contact.id]);
  }

  changePageNumber(page): void {
    if (this.isLoading) {
      return;
    }
    this.getContacts$({ page }).subscribe();
  }

  changePageSize(limit): void {
    this.getContacts$({
      page: 1,
      limit
    }).subscribe();
  }

  changeAllContactsOption(): void {
    this.getContacts$({ any: this.allContactsOption }).subscribe();
  }

  searchText(text) {
    this.getContacts$({ textSearch: text }).subscribe();
  }

  private setAvatars(contacts: IContact[]) {
    _.forEach(contacts, contact => {
      const text = `${_.get(contact, 'firstName[0]', '')}${_.get(
        contact,
        'lastName[0]',
        ''
      )}`.toUpperCase();
      this.avatarsMap.set(contact.id, {
        text,
        color: randomMaterialColor.getColor({
          text
        }),
        src: contact.avatarUrl
      });
    });
  }

  private getContacts$(
    options?: Partial<IContactsQuery>
  ): Observable<IContact[]> {
    const { totalPages, ...payload } = this.query;
    return of({}).pipe(
      tap(() => (this.isLoading = true)),
      flatMap(() =>
        this.contactsService.getContacts$(_.assign({}, payload, options))
      ),
      finalize(() => (this.isLoading = false))
    );
  }
}
