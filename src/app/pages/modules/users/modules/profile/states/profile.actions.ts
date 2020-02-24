/* tslint:disable:no-namespace */
import { IUser } from '../../../interfaces/user.interface';

export namespace ProfileAction {
  export class SetProfile {
    static readonly type = '[Profile] Set Profile';
    constructor(public profile: IUser) {}
  }
}
