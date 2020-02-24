/* tslint:disable:no-namespace */
import { IContact } from '../interfaces/contact.interface';
import { IContactsQuery } from '../interfaces/contacts-query.interface';

export namespace ContactsAction {
  export class SetContacts {
    static readonly type = '[Contacts] Set Contacts';
    constructor(public contacts: IContact[], public query?: IContactsQuery) {}
  }

  export class RemoveContacts {
    static readonly type = '[Contacts] Remove Contacts';
  }

  export class SetActiveContact {
    static readonly type = '[Contacts] Set Active Contact';
    constructor(public contact: IContact) {}
  }

  export class RemoveActiveContact {
    static readonly type = '[Contacts] Remove Active Contact';
  }

  export class CreateContact {
    static readonly type = '[Contacts] Create Contact';
    constructor(public contact: IContact) {}
  }

  export class UpdateContact {
    static readonly type = '[Contacts] Update Contact';
    constructor(public contact: IContact) {}
  }

  export class RemoveContact {
    static readonly type = '[Contacts] Remove Contact';
    constructor(public contactId: string) {}
  }
}
