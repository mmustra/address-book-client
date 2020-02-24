import { IUser } from './user.interface';

export interface IUserPayload
  extends Omit<
    IUser,
    'id' | 'fullName' | 'contactsCount' | 'createdAt' | 'updatedAt'
  > {}
