/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

import * as NB_AUTH from '@nebular/auth';
import { HttpClient } from '@angular/common/http';
import { NbLogoutComponent } from '@nebular/auth';

@Component({
  selector: 'ngx-logout',
  template: `
    <div>Logging out, please wait...</div>
  `,
})
export class NgxLogoutComponent extends NbLogoutComponent implements OnChanges {
  @Input() token;

  redirectDelay: number = 0;
  strategy: string = '';

  constructor(protected service: NB_AUTH.NbAuthService,
    private httpClient: HttpClient,
    @Inject(NB_AUTH.NB_AUTH_OPTIONS) protected options = {},
    protected router: Router) {
    super(service, options, router);
    this.redirectDelay = super.getConfigValue('forms.logout.redirectDelay');
    this.strategy = super.getConfigValue('forms.logout.strategy');
  }

  ngOnChanges(changes: SimpleChanges) {
    this.logout(this.strategy);
  }

  logout(strategy: string): void {

    this.httpClient.post('/planet/rest/logout', {
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
}
