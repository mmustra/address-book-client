import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofActionDispatched } from '@ngxs/store';

import { AuthAction } from './auth/states/auth.actions';
import { PermissionService } from './shared/services/permisssion.service';

@Component({
  selector: 'app-root',
  template: '<div class="container"><router-outlet></router-outlet></div>',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private actions: Actions,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.actions.pipe(ofActionDispatched(AuthAction.Logout)).subscribe(() => {
      const redirectUrl = _.get(this.router, 'routerState.snapshot.url', '');
      const queryParams = redirectUrl ? { redirectUrl } : null;
      this.router
        .navigate(['/auth/login'], { queryParams })
        .then(() => this.permissionService.removeActiveRole());
    });
  }
}
