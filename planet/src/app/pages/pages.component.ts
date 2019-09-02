import { Component } from '@angular/core';
import { NbSidebarService, NbMenuItem } from '@nebular/theme';
import { MENU_ITEMS } from './pages-menu';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu" (click)="onPageClicked()"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {

  menu: NbMenuItem[];
  role: string;
  constructor(private sidebarService: NbSidebarService,
    private authService: NbAuthService) {

    this.menu = MENU_ITEMS;
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.role = token['payload']['role'];
          this.menu = this.menu.map(val => {
            if (val['title'] === 'User Administration' || val['title'] === 'System Parameters') {
              val['hidden'] = this.role !== 'admin';
            }
            return val;
          });
        }
      });
  }

  onPageClicked() {
    this.sidebarService.collapse('settings-sidebar');
  }
}
