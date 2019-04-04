import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAuthModule, NbPasswordAuthStrategy, NbAuthJWTToken } from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { of as observableOf } from 'rxjs';
import { EnvService } from '../env.service';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { DataModule } from './data/data.module';
import {
  AnalyticsService,
  LayoutService,
  PlayerService,
  StateService,
} from './utils';

const env = new EnvService();

export class NbSimpleRoleProvider extends NbRoleProvider {

  getRole() {
    // here you could provide any role based on any auth flow
    return observableOf('guest');
  }
}

const formSetting: any = {
  redirectDelay: 0,
  showMessages: {
    success: true,
  },
};

export const NB_CORE_PROVIDERS = [
  ...DataModule.forRoot().providers,
  ...NbAuthModule.forRoot({

    strategies: [
      NbPasswordAuthStrategy.setup({
        name: 'email',
        token: {
          class: NbAuthJWTToken,
        },
        refreshToken: {
          endpoint: '/refresh',
        },
        baseEndpoint: 'http://' + env.planet + ':' + env.planetRESTPort,
        login: {
          endpoint: '/login_with_email_password',
          method: 'post',
          redirect: {
            success: 'pages/scenario-creator',
            failure: null,
          },
          defaultErrors: ['Login/Email combination is not correct, please try again.'],
          defaultMessages: ['You have been successfully logged in. Redirecting...'],
        },
        requestPass: {
          endpoint: '/forgot',
          method: 'post',
        },
        resetPass: {
          endpoint: '/reset',
        },
      }),
    ],
    forms: {
      login: formSetting,
      register: formSetting,
      requestPassword: formSetting,
      resetPassword: formSetting,
      logout: {
        redirectDelay: 0,
      },
    },
  }).providers,

  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
        view: '*',
      },
      user: {
        parent: 'guest',
        create: '*',
        edit: '*',
        remove: '*',
      },
    },
  }).providers,

  {
    provide: NbRoleProvider, useClass: NbSimpleRoleProvider,
  },
  AnalyticsService,
  LayoutService,
  PlayerService,
  StateService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    NbAuthModule,
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}