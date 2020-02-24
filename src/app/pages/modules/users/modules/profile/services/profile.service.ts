import { Observable } from 'rxjs';
import { flatMap, map, withLatestFrom } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';

import { IUserPayload } from '../../../interfaces/user-payload.interface';
import { IUser } from '../../../interfaces/user.interface';
import { ProfileAction } from '../states/profile.actions';
import { ProfileState } from '../states/profile.state';
import { ProfileApiService } from './profile.api.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(
    private store: Store,
    private profileApiService: ProfileApiService
  ) {}

  @Select(ProfileState.profile)
  profile$: Observable<IUser>;

  get profile(): IUser {
    return this.store.selectSnapshot(ProfileState.profile);
  }

  getProfile$(): Observable<IUser> {
    return this.profileApiService.getProfile$().pipe(
      flatMap(profile =>
        this.store.dispatch(new ProfileAction.SetProfile(profile))
      ),
      withLatestFrom(this.profile$),
      map(results => results.pop())
    );
  }

  updateProfile$(payload: Partial<IUserPayload>): Observable<IUser> {
    return this.profileApiService.updateProfile$(this.profile.id, payload).pipe(
      flatMap(profile =>
        this.store.dispatch(new ProfileAction.SetProfile(profile))
      ),
      withLatestFrom(this.profile$),
      map(results => results.pop())
    );
  }
}
