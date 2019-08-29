import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalDataSource } from 'ng2-smart-table';
import { ViewCell } from 'ng2-smart-table';

@Component({
  template: `
  <nb-user [picture]="rowData.image" [name]="rowData.fullName"
    [title]="rowData.isAdmin ? 'Admin': 'Regular User' " size="large"></nb-user>
  `,
})
export class FullNameComponent implements ViewCell {
  @Input() value: any;    // This hold the cell value
  @Input() rowData: any;  // This holds the entire row object
}


@Component({
  selector: 'ngx-user-administration',
  templateUrl: './user-administration.component.html',
  styleUrls: ['./user-administration.component.scss'],
})
export class UserAdministrationComponent implements OnInit {

  users: Object;

  userSettings = {
    hideSubHeader: true,
    actions: {
      width: '10%',
      add: false,
      edit: false,
      delete: false,
      custom: [
        {
          name: 'editAction',
          title: '<i class="ion-edit" title="Edit"></i>',
        },
        {
          name: 'deleteAction',
          title: '<i class="far fa-trash-alt" title="delete"></i>',
        },
      ],
    },
    columns: {
      fullName: {
        title: 'Full Name',
        type: 'custom',
        renderComponent: FullNameComponent,
      },
      email: {
        title: 'Email',
      },
      isAdmin: {
        title: 'Administrator',
      },
    },
  };

  userSource: LocalDataSource = new LocalDataSource();

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    const url = '/planet/rest/get_user_list';
    this.httpClient.get(url)
      .subscribe(
        (users) => {
          this.users = users['userList'];
          this.userSource.load(users['userList']);
        },
        (error) => {
          // console.log(error);
        },
      );
  }
  public getUserRole(isAdmin: boolean): string {
    return isAdmin ? 'Admin' : 'Regular User';
  }

}
