import { Role } from '../../../../shared/enums/role.enum';

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  roles: Role[];
  avatarUrl: string;
  contactsCount: number;
  readonly: boolean;
  createdAt: string;
  updatedAt: string;
}
