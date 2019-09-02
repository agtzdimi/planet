import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalDataSource } from 'ng2-smart-table';
import { UserAdminPictureComponent } from './user-admin-picture/user-admin-picture.component';
import { UserAdminRoleComponent } from './user-admin-role/user-admin-role.component';
import { NbDialogService, NbDialogConfig } from '@nebular/theme';
import { DialogSubmitPromptComponent, DialogInfoPromptComponent } from '../../@theme/components';

@Component({
  selector: 'ngx-user-administration',
  templateUrl: './user-administration.component.html',
  styleUrls: ['./user-administration.component.scss'],
})
export class UserAdministrationComponent implements OnInit {

  users: Object;

  userSettings = {
    hideSubHeader: true,
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      fullName: {
        title: 'Full Name',
        type: 'custom',
        renderComponent: UserAdminPictureComponent,
      },
      email: {
        title: 'Email',
      },
      role: {
        title: 'Role',
        type: 'custom',
        renderComponent: UserAdminRoleComponent,
        editor: {
          type: 'list',
          config: {
            list: [
              { value: 'admin', title: 'Administrator' },
              { value: 'unitManager', title: 'Unit Manager' },
              { value: 'dso', title: 'DSO' },
            ],
          },
        },
      },
    },
  };

  userSource: LocalDataSource = new LocalDataSource();
  public formName: string = 'Select a Scenario';
  public status: string = '';

  constructor(private httpClient: HttpClient,
    private dialogService: NbDialogService) {
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

  onDeleteConfirm(event): void {
    this.status = '';
    const context: Object = {
      context: {
        title: 'Are you sure you Want to Delete this User?',
      },
    } as Partial<NbDialogConfig<string | Partial<DialogSubmitPromptComponent>>>;
    this.dialogService.open(DialogSubmitPromptComponent, context)
      .onClose.subscribe(value => {
        if (value) {
          event.confirm.resolve();
        } else {
          event.confirm.reject();
        }
      });
  }

  validateEdit(editEvent) {
    const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regexp.test(editEvent['newData']['email'])) {
      editEvent.confirm.resolve();
    } else {
      const context: Object = {
        context: {
          title: 'The email value is not valid!',
        },
      } as Partial<NbDialogConfig<string | Partial<DialogInfoPromptComponent>>>;
      this.dialogService.open(DialogInfoPromptComponent, context)
        .onClose.subscribe();
    }
  }

}
