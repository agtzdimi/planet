import { Component, Input } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-user-admin-picture',
  template: `
  <nb-user [picture]="rowData.image" [name]="rowData.fullName"
    [title]="getUserRole(rowData['role'])" size="large"></nb-user>
  `,
  styleUrls: ['./user-admin-picture.component.scss'],
})
export class UserAdminPictureComponent implements ViewCell {

  constructor() { }

  @Input() value: any;    // This hold the cell value
  @Input() rowData: any;  // This holds the entire row object

  public getUserRole(role: string): string {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'unitManager':
        return 'Unit Manager';
      case 'dso':
        return 'DSO';
      default:
        return '';
    }
  }

}
