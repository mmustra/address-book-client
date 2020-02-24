import { IContact } from './contact.interface';

export interface IContactPayload
  extends Omit<
    IContact,
    'id' | 'userId' | 'fullName' | 'createdAt' | 'updatedAt'
  > {}
