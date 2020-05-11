import { Component } from '@angular/core';
import { NbAuthComponent } from '@nebular/auth';

@Component({
  selector: 'ngx-auth',
  styleUrls: ['./auth.component.scss'],
  template: `
  <nb-layout>
  <nb-layout-column>
    <nb-card accent="primary">
      <nb-card-header [ngStyle]="{'margin':'0 auto'}">
        <a href="https://www.h2020-planet.eu/" target="_blank"><img src="assets/images/planet.png"></a>
      </nb-card-header>
      <nb-card-body>
        <div class="flex-centered col-xl-4 col-lg-6 col-md-8 col-sm-12">
          <router-outlet></router-outlet>
        </div>
      </nb-card-body>
    </nb-card>
  </nb-layout-column>
</nb-layout>
  `,
})
export class NgxAuthComponent extends NbAuthComponent {

  subscription: any;

  authenticated: boolean = false;
  token: string = '';


  back() {
    this.location.back();
    return false;
  }
}
