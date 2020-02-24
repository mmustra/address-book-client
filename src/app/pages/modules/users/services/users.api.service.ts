import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IUserPayload } from '../interfaces/user-payload.interface';
import { IUser } from '../interfaces/user.interface';
import { IUsersQuery } from '../interfaces/users-query.interface';
import { IUsersResponse } from '../interfaces/users-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService extends ApiService {
  constructor(private http: HttpClient) {
    super();
  }

  getUsers$(
    options?: Omit<IUsersQuery, 'totalPages'>
  ): Observable<IUsersResponse> {
    const url = `${this.apiUrl}/users`;

    return this.http.get<IUsersResponse>(url, {
      params: {
        page: _.get(options, 'page', ''),
        limit: _.get(options, 'limit', ''),
        textSearch: _.get(options, 'textSearch', ''),
        any: _.get(options, 'any', '')
      }
    });
  }

  updateUser$(
    userId: string,
    payload: Partial<IUserPayload>
  ): Observable<IUser> {
    const url = `${this.apiUrl}/users/${userId}`;

    return this.http.patch<IUser>(url, payload);
  }

  deleteUser$(userId: string): Observable<void> {
    const url = `${this.apiUrl}/users/${userId}`;

    return this.http.delete<void>(url);
  }
}
