import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxPermissionsModule } from 'ngx-permissions';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { IconsProviderModule } from './icons-provider.module';
import { ProfileModule } from './modules/users/modules/profile/profile.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';

@NgModule({
  declarations: [PagesComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    NgZorroAntdModule,
    NgxPermissionsModule.forChild(),
    IconsProviderModule,
    FlexLayoutModule,
    ProfileModule
  ]
})
export class PagesModule {}
