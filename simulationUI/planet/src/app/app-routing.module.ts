import { ExtraOptions, RouterModule, Routes, UrlSegment, UrlMatchResult } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './auth-guard.service';
import {
  NbLogoutComponent,
} from '@nebular/auth';

import { NgxLoginComponent } from './@theme/components/auth/login/login.component';
import { NbAuthComponent } from './@theme/components/auth/auth.component';
import { NgxRegisterComponent } from './@theme/components/auth/register/register.component';
import { NgxRequestPasswordComponent } from './@theme/components/auth/request-password/request-password.component';
import { NgxResetPasswordComponent } from './@theme/components/auth/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: 'pages',
    canActivate: [AuthGuard], // here we tell Angular to check the access with our AuthGuard
    loadChildren: 'app/pages/pages.module#PagesModule',
  },
  {
    path: 'auth',
    component: NbAuthComponent,
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
        component: NbLogoutComponent,
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
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
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
