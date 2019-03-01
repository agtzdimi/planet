import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { AnalyticsService } from '../../../@core/utils';
import { NbAuthService, NbAuthSimpleToken } from '@nebular/auth';
import { LayoutService } from '../../../@core/utils';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  @Input() position = 'normal';

  myImage = new Image(100, 200);
  user = {};
  logOut = false;
  login_token;

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private analyticsService: AnalyticsService,
    private layoutService: LayoutService,
    private authService: NbAuthService) {
    this.myImage.src = 'assets/images/DAg.jpg';
    this.authService.onTokenChange()
      .subscribe((token: NbAuthSimpleToken) => {
        if (token.isValid()) {
          this.login_token = token['token']['login_token'];
          this.user = token['token']['payload']; // here we receive a payload from the token and assigne it to our `user` variable
        }

      });
  }

  ngOnInit() {
    this.menuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'userProfile'),
        map(({ item: { title } }) => title),
      )
      .subscribe(title => {
        if (title.includes('Log out')) {
          this.logOut = true;
        }
      });
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');

    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }
}
