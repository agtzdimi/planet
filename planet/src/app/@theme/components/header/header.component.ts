import { Component, OnDestroy, OnInit, Input, HostListener } from '@angular/core';
import { NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { LayoutService } from '../../../@core/utils';
import { filter, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { UserProfileService } from '../../services/user-profile.service';
import { NbAuthService, NbAuthJWTToken, NbAuthResult } from '@nebular/auth';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
  providers: [UserProfileService],
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Input() position = 'normal';

  @HostListener('document:ImageEvent', ['$event'])
  updateImage(event) {
    this.user['image'] = event['detail']['image'];
    this.authService.refreshToken('email', this.user)
      .subscribe((result: NbAuthResult) => {
      });
  }

  user = {};
  logOut = false;
  login_token;

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'dark';

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private layoutService: LayoutService,
    private authService: NbAuthService,
    protected router: Router) {

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.login_token = token['token'];
          this.user['name'] = token['payload']['fullName']; // here we receive a payload from the token and assign it to our user variable
          this.user['image'] = token['payload']['image'];
          this.user['email'] = token['payload']['email'];
        }

      });
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    this.menuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'userProfile'),
        map(({ item: { title } }) => title),
      )
      .subscribe(title => {
        if (title.includes('Log out')) {
          this.logOut = true;
        } else if (title.includes('Profile')) {
          setTimeout(() => {
            return this.router.navigateByUrl('/pages/user-profile');
          }, 1000);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
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

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
