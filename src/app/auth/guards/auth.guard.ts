import _ from 'lodash';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Store } from '@ngxs/store';

import { ProfileService } from '../../pages/modules/users/modules/profile/services/profile.service';
import { PermissionService } from '../../shared/services/permisssion.service';
import { AuthState } from '../states/auth.state';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(
    private router: Router,
    private store: Store,
    private profileService: ProfileService,
    private permissionService: PermissionService
  ) {}

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    const token = this.store.selectSnapshot(AuthState.token);

    if (token) {
      return this.profileService.getProfile$().pipe(
        tap(user => {
          this.permissionService.setActiveRole(user.roles[0]);
        }),
        map(user => Boolean(user))
      );
    }

    const redirectUrl = _.get(this.router, 'routerState.snapshot.url', '');
    const queryParams = redirectUrl ? { redirectUrl } : null;
    this.router.navigate(['/auth/login'], { queryParams });

    return false;
  }
}
