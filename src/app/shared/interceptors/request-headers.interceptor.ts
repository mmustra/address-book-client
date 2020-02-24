import { Observable } from 'rxjs';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';

import { AuthState } from '../../auth/states/auth.state';

@Injectable()
export class RequestHeadersInterceptor implements HttpInterceptor {
  constructor(private store: Store, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.store.selectSnapshot(AuthState.token);
    const modifiedRequest = req.clone({
      headers: req.headers.set('Authorization', token ? `Bearer ${token}` : '')
    });

    return next.handle(modifiedRequest);
  }
}
