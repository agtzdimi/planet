import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
  <span class="created-by"></span>
  <div class="socials">
    <a href="mailto:mariapia.martino@polito.it" target="_blank" class="ion ion-email-unread" [ngStyle]="{'font-size':'34px'}"></a>
    <a href="https://www.youtube.com/channel/UCJ46Pn1YWFTbNu2EFt4dvdA" target="_blank" class="ion ion-social-youtube"></a>
    <a href="https://twitter.com/h2020_planet" target="_blank" class="ion ion-social-twitter"></a>
    <a href="https://www.linkedin.com/company/planet-h2020/" target="_blank" class="ion ion-social-linkedin"></a>
  </div>
  `,
})
export class FooterComponent {
}
