import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { PagesModule } from './pages/pages.module';
import { UserResolver } from './shared/resolvers/user.resolver';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: (): Promise<AuthModule> =>
      import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    loadChildren: (): Promise<PagesModule> =>
      import('./pages/pages.module').then(m => m.PagesModule),
    canLoad: [AuthGuard],
    resolve: {
      user: UserResolver
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
