/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit, HostListener } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import {TabCount} from './@theme/components/count_tabs';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})


export class AppComponent implements OnInit {

  tabCount = new TabCount();

  @HostListener('window:beforeunload', ['$event'])
beforeunloadHandler(event) {
    this.clear();
}


  constructor(private analytics: AnalyticsService ,
    private router: Router) {
  }


  ngOnInit(): void {
    localStorage.setItem('login_token', '51336');
    this.analytics.trackPageViews();

    window.addEventListener('storage', (event) => {
      if (event.storageArea === localStorage) {
        const token = localStorage.getItem('login_token');
        if (token === null) { setTimeout(() => {
              return this.router.navigateByUrl('/auth/login');
            }, 50);
        }
      }
    }, false);
  }

  clear(): void {
     if (this.tabCount.tabsCount() === 1) {
      localStorage.clear();
     }
  }

}
