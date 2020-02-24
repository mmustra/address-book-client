import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IUserPayload } from '../../../interfaces/user-payload.interface';
import { IUser } from '../../../interfaces/user.interface';
import { UsersApiService } from '../../../services/users.api.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileApiService extends ApiService {
  constructor(
    private http: HttpClient,
    private usersApiService: UsersApiService
  ) {
    super();
  }

  getProfile$(): Observable<IUser> {
    const url = `${this.apiUrl}/users/current`;

    return this.http.get<IUser>(url);
  }

  updateProfile$(
    userId: string,
    payload: Partial<IUserPayload>
  ): Observable<IUser> {
    return this.usersApiService.updateUser$(userId, payload);
  }
}
