/* tslint:disable:no-namespace */
import { IAuthResponse } from '../interfaces/auth-response';

export namespace AuthAction {
  export class Register {
    static readonly type = '[Auth] Register';
    constructor(public payload: IAuthResponse) {}
  }

  export class Login {
    static readonly type = '[Auth] Login';
    constructor(public payload: IAuthResponse) {}
  }

  export class Logout {
    static readonly type = '[Auth] Logout';
  }
}
