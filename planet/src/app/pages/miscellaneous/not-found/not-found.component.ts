import { Component } from '@angular/core';

import { NbMenuService } from '@nebular/theme';

/**
 * Component responsible for throwing '404 error page does not exist' to the user,
 * whenever the URL is invalid
 */
@Component({
  selector: 'ngx-not-found',
  styleUrls: ['./not-found.component.scss'],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {

  /**
     * @param {NbMenuService} menuService Nebular service to be used to navigate to Home Page
     */
  constructor(private menuService: NbMenuService) {
  }

  /**
  * Function triggered when a user press the button to navigate home given an invalid URL
  * @example
  * goToHome()
  *
  */
  public goToHome() {
    this.menuService.navigateHome();
  }
}
