import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxPermissionsModule } from 'ngx-permissions';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';

import { SharedModule } from '../../../shared/shared.module';
import { AllContactsComponent } from './components/all-contacts/all-contacts.component';
import { SingleContactComponent } from './components/single-contact/single-contact.component';
import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactsComponent } from './contacts.component';
import { ContactsService } from './services/contacts.service';
import { ContactsState } from './states/contacts.state';

@NgModule({
  declarations: [
    ContactsComponent,
    AllContactsComponent,
    SingleContactComponent
  ],
  providers: [ContactsService],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ContactsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPermissionsModule.forChild(),
    NgxsModule.forFeature([ContactsState]),
    NgZorroAntdModule,
    FlexLayoutModule
  ]
})
export class ContactsModule {}
