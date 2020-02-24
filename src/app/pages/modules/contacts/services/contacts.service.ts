import { forkJoin, Observable, of } from 'rxjs';
import { flatMap, map, withLatestFrom } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';

import { ProfileService } from '../../users/modules/profile/services/profile.service';
import { IContactPayload } from '../interfaces/contact-payload.interface';
import { IContact } from '../interfaces/contact.interface';
import { IContactsQuery } from '../interfaces/contacts-query.interface';
import { ContactsAction } from '../states/contacts.actions';
import { ContactsState } from '../states/contacts.state';
import { ContactsApiService } from './contacts.api.service';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  constructor(
    private store: Store,
    private contactApiService: ContactsApiService,
    private profileService: ProfileService
  ) {}

  @Select(ContactsState.contacts)
  contacts$: Observable<IContact[]>;

  @Select(ContactsState.activeContact)
  activeContact$: Observable<IContact>;

  @Select(ContactsState.query)
  query$: Observable<IContactsQuery>;

  get contacts(): IContact[] {
    return this.store.selectSnapshot(ContactsState.contacts);
  }

  get activeContact(): IContact {
    return this.store.selectSnapshot(ContactsState.activeContact);
  }

  get query(): IContactsQuery {
    return this.store.selectSnapshot(ContactsState.query);
  }

  getContacts$(
    options: Omit<IContactsQuery, 'totalPages'> = {}
  ): Observable<IContact[]> {
    return this.contactApiService.getAllContacts$(options).pipe(
      flatMap(contactsData => {
        const { docs: contacts, page, limit, totalPages } = contactsData;
        return this.store.dispatch(
          new ContactsAction.SetContacts(contacts, {
            page,
            limit,
            totalPages,
            textSearch: options.textSearch,
            any: options.any
          })
        );
      }),
      withLatestFrom(this.contacts$),
      map(results => results.pop())
    );
  }

  removeContacts$(): Observable<IContact[]> {
    return this.store.dispatch(new ContactsAction.RemoveContacts()).pipe(
      withLatestFrom(this.contacts$),
      map(() => [])
    );
  }

  getAndActivateContact$(contactId: string): Observable<IContact> {
    return this.getContact$(contactId).pipe(
      flatMap(contact =>
        forkJoin(
          of(contact),
          this.store.dispatch(new ContactsAction.SetActiveContact(contact))
        )
      ),
      withLatestFrom(this.activeContact$),
      map(result => result[0][0])
    );
  }

  getContact$(contactId: string): Observable<IContact> {
    return this.contactApiService.getContact$(contactId).pipe(
      flatMap(contact =>
        forkJoin(
          of(contact),
          this.store.dispatch(new ContactsAction.UpdateContact(contact))
        )
      ),
      withLatestFrom(this.contacts$),
      map(results => results[0][0])
    );
  }

  createContact$(contactData: IContactPayload): Observable<IContact> {
    return this.contactApiService.createContact$(contactData).pipe(
      flatMap(contact =>
        forkJoin(
          of(contact),
          this.store.dispatch(new ContactsAction.CreateContact(contact))
        )
      ),
      flatMap(([contact]) =>
        forkJoin(of(contact), this.profileService.getProfile$())
      ),
      withLatestFrom(this.contacts$),
      map(([results]) => {
        return results[0];
      })
    );
  }

  updateContact$(
    contactId: string,
    contactData: IContactPayload
  ): Observable<IContact> {
    return this.contactApiService.updateContact$(contactId, contactData).pipe(
      flatMap(contact =>
        forkJoin(
          of(contact),
          this.store.dispatch(new ContactsAction.UpdateContact(contact))
        )
      ),
      withLatestFrom(this.contacts$),
      map(([contact]) => (contact as unknown) as IContact)
    );
  }

  removeActiveContact$(): Observable<void> {
    return this.store.dispatch(new ContactsAction.RemoveActiveContact()).pipe(
      withLatestFrom(this.activeContact$),
      map(() => null)
    );
  }

  deleteContact$(contactId: string): Observable<void> {
    return this.contactApiService.deleteContact$(contactId).pipe(
      flatMap(() =>
        this.store.dispatch(new ContactsAction.RemoveContact(contactId))
      ),
      flatMap(() => this.profileService.getProfile$()),
      withLatestFrom(this.contacts$),
      map(() => null)
    );
  }
}
