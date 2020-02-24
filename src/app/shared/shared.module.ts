import { NgZorroAntdModule } from 'ng-zorro-antd';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

import { SearchComponent } from './components/search/search.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';

@NgModule({
  declarations: [SearchComponent, SafeUrlPipe],
  imports: [CommonModule, FormsModule, NgZorroAntdModule, FlexLayoutModule],
  exports: [SearchComponent, SafeUrlPipe]
})
export class SharedModule {}
