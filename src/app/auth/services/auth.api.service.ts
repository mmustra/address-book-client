import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiService } from '../../shared/services/api.service';
import { IAuthLoginRequest } from '../interfaces/auth-login-request';
import { IAuthRegisterRequest } from '../interfaces/auth-register-request';
import { IAuthResponse } from '../interfaces/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService extends ApiService {
  constructor(private http: HttpClient) {
    super();
  }

  login$(payload: IAuthLoginRequest): Observable<IAuthResponse> {
    const url = `${this.apiUrl}/auth/login`;

    return this.http.post<IAuthResponse>(url, payload);
  }

  register$(payload: IAuthRegisterRequest): Observable<IAuthResponse> {
    const url = `${this.apiUrl}/auth/register`;

    return this.http.post<IAuthResponse>(url, payload);
  }
}
