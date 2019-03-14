import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnitManagementComponent } from './unit-management.component';
import { UnitAddComponent } from './unit-add/unit-add.component';
import { UnitEditComponent } from './unit-edit/unit-edit.component';
import { UnitDeleteComponent } from './unit-delete/unit-delete.component';

const routes: Routes = [{
  path: '',
  component: UnitManagementComponent,
  children: [
    {
      path: 'unit-add',
      component: UnitAddComponent,
    },
    {
      path: 'unit-edit',
      component: UnitEditComponent,
    },
    {
      path: 'unit-delete',
      component: UnitDeleteComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnitManagementRoutingModule { }
