import { Component } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { MENU_ITEMS } from './pages-menu';

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

  constructor(private sidebarService: NbSidebarService) {

  }


  menu = MENU_ITEMS;
  onPageClicked() {
    this.sidebarService.collapse('settings-sidebar');
  }
}
