import { IContactsPagination } from './contacts-pagintaion.interface';

export interface IContactsQuery extends Partial<IContactsPagination> {
  textSearch?: string;
  any?: boolean;
}
