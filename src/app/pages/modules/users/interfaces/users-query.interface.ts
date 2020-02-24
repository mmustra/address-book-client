import { IUsersPagination } from './users-pagintaion.interface';

export interface IUsersQuery extends Partial<IUsersPagination> {
  textSearch?: string;
}
