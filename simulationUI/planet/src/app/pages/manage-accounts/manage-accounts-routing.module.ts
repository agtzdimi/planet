import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageAccountsComponent } from './manage-accounts.component';
import { ManageAccComponent } from './manage/manage.component';


const routes: Routes = [{
  path: '',
  component: ManageAccountsComponent,
  children: [
    {
      path: 'manage',
      component: ManageAccComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageAccountsRoutingModule { }
