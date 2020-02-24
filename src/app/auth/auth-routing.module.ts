import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticateComponent } from './components/authenticate/authenticate.component';
import { UnAuthGuard } from './guards/unauth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: AuthenticateComponent,
    canActivate: [UnAuthGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
