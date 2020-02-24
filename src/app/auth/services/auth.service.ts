import { Observable } from 'rxjs';
import { flatMap, map, withLatestFrom } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';

import { IAuthLoginRequest } from '../interfaces/auth-login-request';
import { IAuthRegisterRequest } from '../interfaces/auth-register-request';
import { AuthAction } from '../states/auth.actions';
import { AuthState } from '../states/auth.state';
import { AuthApiService } from './auth.api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private store: Store, private authApiService: AuthApiService) {}

  @Select(AuthState.token)
  token$: Observable<string>;

  login$(requestPayload: IAuthLoginRequest): Observable<string> {
    return this.authApiService.login$(requestPayload).pipe(
      flatMap(payload => this.store.dispatch(new AuthAction.Login(payload))),
      withLatestFrom(this.token$),
      map(results => results.pop())
    );
  }

  register$(requestPayload: IAuthRegisterRequest): Observable<string> {
    return this.authApiService.register$(requestPayload).pipe(
      flatMap(payload => this.store.dispatch(new AuthAction.Register(payload))),
      withLatestFrom(this.token$),
      map(results => results.pop())
    );
  }

  logout$(): Observable<string> {
    return this.store.dispatch(new AuthAction.Logout()).pipe(
      withLatestFrom(this.token$),
      map(results => results.pop())
    );
  }
}
