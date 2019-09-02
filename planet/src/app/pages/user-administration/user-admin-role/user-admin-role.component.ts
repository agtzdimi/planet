import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-user-admin-role',
  template: `
  {{value}}
 `,
  styleUrls: ['./user-admin-role.component.scss'],
})
export class UserAdminRoleComponent implements ViewCell, OnInit {

  @Input() value: any;    // This hold the cell value
  @Input() rowData: any;  // This holds the entire row object

  constructor() { }

  ngOnInit() {
    this.value = this.getUserRole(this.value);
  }

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
