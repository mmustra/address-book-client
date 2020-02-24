import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AllContactsComponent } from './components/all-contacts/all-contacts.component';
import { SingleContactComponent } from './components/single-contact/single-contact.component';
import { ContactsComponent } from './contacts.component';

const routes: Routes = [
  {
    path: '',
    component: ContactsComponent,
    children: [
      {
        path: '',
        component: AllContactsComponent,
        data: {
          title: 'Contacts'
        }
      },
      {
        path: 'new',
        component: SingleContactComponent,
        data: {
          title: 'New Contact'
        }
      },
      {
        path: ':id',
        component: SingleContactComponent,
        data: {
          title: 'Contact Entry'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactsRoutingModule {}
