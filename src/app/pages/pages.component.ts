import { Subject } from 'rxjs';
import { filter, map, mergeMap, takeUntil } from 'rxjs/operators';

import { Location } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { AuthService } from '../auth/services/auth.service';
import { Permission } from '../shared/enums/permission.enum';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.less']
})
export class PagesComponent implements OnDestroy {
  Permission = Permission;
  destroy$: Subject<void>;
  isRootRoute: boolean;
  contentTitle: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private locationService: Location,
    private authService: AuthService
  ) {
    this.destroy$ = new Subject();
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter(event => event instanceof NavigationEnd),
        map(() => this.route),
        map(activeRoute => {
          while (activeRoute.firstChild) {
            activeRoute = activeRoute.firstChild;
          }
          return activeRoute;
        }),
        filter(mappedRoute => mappedRoute.outlet === 'primary'),
        mergeMap(filteredRoute => filteredRoute.data)
      )
      .subscribe(data => {
        this.isRootRoute = Boolean(data.root);
        this.contentTitle = data.title;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(): void {
    this.locationService.back();
  }

  logout(): void {
    this.authService.logout$().subscribe();
  }
}
