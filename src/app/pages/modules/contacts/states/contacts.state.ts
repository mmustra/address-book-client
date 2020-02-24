import * as _ from 'lodash';

import { ImmutableContext } from '@ngxs-labs/immer-adapter';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { AuthAction } from '../../../../auth/states/auth.actions';
import { IContact } from '../interfaces/contact.interface';
import { IContactsQuery } from '../interfaces/contacts-query.interface';
import { ContactsAction } from './contacts.actions';

export class ContactsStateModel {
  contacts: IContact[];
  query: IContactsQuery;
  activeContact: IContact;
}

const contactsInitialState: ContactsStateModel = {
  contacts: [],
  query: null,
  activeContact: null
};

@State<ContactsStateModel>({
  name: 'contacts',
  defaults: contactsInitialState
})
export class ContactsState {
  @Selector()
  static contacts(state: ContactsStateModel): IContact[] {
    return state.contacts;
  }

  @Selector()
  static activeContact(state: ContactsStateModel): IContact {
    return state.activeContact;
  }

  @Selector()
  static query(state: ContactsStateModel): IContactsQuery {
    return state.query;
  }

  @Action(ContactsAction.SetContacts)
  @ImmutableContext()
  setContacts(
    { setState }: StateContext<ContactsStateModel>,
    { contacts, query }: ContactsAction.SetContacts
  ): void {
    setState((draft: ContactsStateModel) => {
      draft.contacts = contacts;
      draft.query = query;

      return draft;
    });
  }

  @Action(ContactsAction.RemoveContacts)
  @ImmutableContext()
  removeContacts({ setState }: StateContext<ContactsStateModel>): void {
    setState((draft: ContactsStateModel) => {
      draft.contacts = contactsInitialState.contacts;
      draft.query = contactsInitialState.query;

      return draft;
    });
  }

  @Action(ContactsAction.SetActiveContact)
  @ImmutableContext()
  setActiveContact(
    { setState }: StateContext<ContactsStateModel>,
    { contact }: ContactsAction.SetActiveContact
  ): void {
    setState((draft: ContactsStateModel) => {
      draft.activeContact = contact;

      return draft;
    });
  }

  @Action(ContactsAction.RemoveActiveContact)
  @ImmutableContext()
  removeActiveContact({ setState }: StateContext<ContactsStateModel>): void {
    setState((draft: ContactsStateModel) => {
      draft.activeContact = contactsInitialState.activeContact;

      return draft;
    });
  }

  @Action(ContactsAction.UpdateContact)
  @ImmutableContext()
  updateContact(
    { setState }: StateContext<ContactsStateModel>,
    { contact }: ContactsAction.UpdateContact
  ): void {
    setState((draft: ContactsStateModel) => {
      const oldContactIndex = _.findIndex(draft.contacts, { id: contact.id });

      if (oldContactIndex >= 0) {
        draft.contacts.splice(oldContactIndex, 1, contact);
      }

      return draft;
    });
  }

  @Action(ContactsAction.RemoveContact)
  @ImmutableContext()
  removeContact(
    { setState }: StateContext<ContactsStateModel>,
    { contactId }: ContactsAction.RemoveContact
  ): void {
    setState((draft: ContactsStateModel) => {
      _.remove(draft.contacts, { id: contactId });

      return draft;
    });
  }

  @Action(AuthAction.Logout)
  @ImmutableContext()
  clearAll({ setState }: StateContext<ContactsStateModel>): void {
    setState(() => contactsInitialState);
  }
}
