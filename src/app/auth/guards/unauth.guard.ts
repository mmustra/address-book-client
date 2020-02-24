import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngxs/store';

import { AuthState } from '../states/auth.state';

@Injectable({
  providedIn: 'root'
})
export class UnAuthGuard implements CanActivate {
  constructor(private router: Router, private store: Store) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = this.store.selectSnapshot(AuthState.token);

    if (token) {
      this.router.navigate(['/']);

      return false;
    }

    return true;
  }
}
