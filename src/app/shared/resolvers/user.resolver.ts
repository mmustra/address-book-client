import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngxs/store';

import { IUser } from '../../pages/modules/users/interfaces/user.interface';
import { ProfileService } from '../../pages/modules/users/modules/profile/services/profile.service';
import { ProfileState } from '../../pages/modules/users/modules/profile/states/profile.state';
import { PermissionService } from '../services/permisssion.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<any> {
  constructor(
    private store: Store,
    private profileService: ProfileService,
    private permissionService: PermissionService
  ) {}

  resolve(): Observable<IUser> {
    const profile = this.store.selectSnapshot(ProfileState.profile);
    if (profile) {
      return of(profile);
    }
    return this.profileService.getProfile$().pipe(
      tap(user => {
        this.permissionService.setActiveRole(user.roles[0]);
      })
    );
  }
}
