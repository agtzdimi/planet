import { ExtraOptions, RouterModule, Routes, UrlSegment, UrlMatchResult } from '@angular/router';
import { AuthGuard } from './auth-guard.service';
import { NgModule } from '@angular/core';

import { NgxLoginComponent } from './@theme/components/auth/login/login.component';
import { NgxAuthComponent } from './@theme/components/auth/auth.component';
import { NgxRegisterComponent } from './@theme/components/auth/register/register.component';
import { NgxRequestPasswordComponent } from './@theme/components/auth/request-password/request-password.component';
import { NgxResetPasswordComponent } from './@theme/components/auth/reset-password/reset-password.component';
import { NgxLogoutComponent } from './@theme/components/auth/logout/logout.component';

const routes: Routes = [
  {
    path: 'pages',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
  {
    path: 'auth',
    component: NgxAuthComponent,
    children: [
      {
        path: '',
        component: NgxLoginComponent,
      },
      {
        path: 'login',
        component: NgxLoginComponent,
      },
      {
        path: 'register',
        component: NgxRegisterComponent,
      },
      {
        path: 'logout',
        component: NgxLogoutComponent,
      },
      {
        path: 'request-password',
        component: NgxRequestPasswordComponent,
      },
      {
        matcher: ResetMatcher,
        component: NgxResetPasswordComponent,
      },
    ],
  },
  { path: '', redirectTo: '/pages/welcome-screen', canActivate: [AuthGuard], pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' },
];

const config: ExtraOptions = {
  useHash: true,
};

export function ResetMatcher(url: UrlSegment[]): UrlMatchResult {
  if (url.length === 0) {
    return null;
  }
  const reg = /^.*reset-password.*$/;
  const param = url[0].toString();
  if (param.match(reg)) {
    return (
      {
        consumed: url,
        posParams: {
          id: url[0],
        },
      }
    );
  } return null;
}


@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
