import { Component } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { StateService } from '../../../@core/utils';

@Component({
  selector: 'ngx-toggle-settings-button',
  styleUrls: ['./toggle-settings-button.component.scss'],
  template: `
    <button class="toggle-settings"
            (click)="toggleSettings()"
            [class.expanded]="expanded"
            [class.sidebarEnd]="sidebarEnd">
            <nb-icon icon="file-text" [status]="'primary'" [ngStyle]="{'height': '100%','width': '100%'}"></nb-icon>
    </button>
  `,
})
export class ToggleSettingsButtonComponent {

  sidebarEnd = false;
  expanded = false;

  constructor(private sidebarService: NbSidebarService, protected stateService: StateService) {
    this.stateService.onSidebarState()
      .subscribe(({ id }) => {
        this.sidebarEnd = id === 'end';
      });

    this.sidebarService.onCollapse()
      .subscribe((data) => {
        if (this.expanded === true) {
          this.expanded = !this.expanded;
        }
      });
  }

  toggleSettings() {
    this.sidebarService.toggle(false, 'settings-sidebar');
    this.expanded = !this.expanded;
  }
}
