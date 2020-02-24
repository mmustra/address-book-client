import { NgxPermissionsGuard } from 'ngx-permissions';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Permission } from '../shared/enums/permission.enum';
import { ContactsModule } from './modules/contacts/contacts.module';
import { UsersModule } from './modules/users/users.module';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'contacts',
        loadChildren: (): Promise<ContactsModule> =>
          import('./modules/contacts/contacts.module').then(
            m => m.ContactsModule
          ),
        data: {
          root: true
        }
      },
      {
        path: 'users',
        loadChildren: (): Promise<UsersModule> =>
          import('./modules/users/users.module').then(m => m.UsersModule),
        canLoad: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: Permission.UsersPage,
            redirectTo: '/contacts'
          },
          root: true
        }
      },
      {
        path: '**',
        redirectTo: 'contacts'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
