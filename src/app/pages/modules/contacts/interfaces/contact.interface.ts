import { IUser } from '../../users/interfaces/user.interface';

export interface IContact {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  emails: string[];
  phones: string[];
  avatarUrl: string;
  notes: string;
  user: Pick<IUser, 'id' | 'firstName' | 'lastName' | 'fullName'>;
  createdAt: string;
  updatedAt: string;
}
