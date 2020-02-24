import * as _ from 'lodash';
import { NzNotificationService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class ResponseErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthService,
    private notification: NzNotificationService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        const errorStatus = _.get(error, 'status', 500);
        const errorTitle = `Error - ${errorStatus}`;
        const errorMessage = _.get(error, 'error.message') || error.message;

        this.notification.error(errorTitle, errorMessage);

        if (errorStatus === 401) {
          this.authService.logout$().subscribe();
        } else if (errorStatus === 403) {
          this.router.navigate(['/']);
        }

        throw error.error || error;
      })
    );
  }
}
