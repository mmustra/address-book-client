import { NgZorroAntdModule } from 'ng-zorro-antd';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';

import { UsersService } from '../../services/users.service';
import { ProfileComponent } from './components/profile.component';
import { ProfileState } from './states/profile.state';

@NgModule({
  declarations: [ProfileComponent],
  providers: [UsersService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxsModule.forFeature([ProfileState]),
    NgZorroAntdModule,
    FlexLayoutModule
  ],
  exports: [ProfileComponent]
})
export class ProfileModule {}
