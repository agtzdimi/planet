/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

import { NB_AUTH_OPTIONS } from '@nebular/auth/auth.options';
import { getDeepFromObject } from '@nebular/auth/helpers';
import { NbAuthService } from '@nebular/auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../../../../env.service';

@Component({
  selector: 'nb-logout',
  template: `
    <div>Logging out, please wait...</div>
  `,
})
export class NbLogoutComponent implements OnChanges {
  @Input() token;

  redirectDelay: number = 0;
  strategy: string = '';

  constructor(protected service: NbAuthService,
    private httpClient: HttpClient,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected router: Router,
    private env: EnvService) {
    this.redirectDelay = this.getConfigValue('forms.logout.redirectDelay');
    this.strategy = this.getConfigValue('forms.logout.strategy');
  }

  ngOnChanges(changes: SimpleChanges) {
    this.logout(this.strategy);
  }

  logout(strategy: string): void {

    this.httpClient.post('http://' + this.env.planet + ':' + this.env.planetRESTPort + '/logout', {
      login_token: this.token,
    },
    )
      .subscribe(
        data => {
          setTimeout(() => {
            return this.router.navigateByUrl('/auth/login');
          }, this.redirectDelay);
        },
        error => {
        },
      );
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
