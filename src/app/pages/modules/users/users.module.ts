import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxPermissionsModule } from 'ngx-permissions';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';

import { SharedModule } from '../../../shared/shared.module';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { UsersService } from './services/users.service';
import { UsersState } from './states/users.state';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';

@NgModule({
  declarations: [UsersComponent, AllUsersComponent],
  providers: [UsersService],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    UsersRoutingModule,
    NgZorroAntdModule,
    FlexLayoutModule,
    NgxPermissionsModule.forChild(),
    NgxsModule.forFeature([UsersState])
  ]
})
export class UsersModule {}
