import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnitAddComponent } from './unit-add/unit-add.component';


const routes: Routes = [{
  path: '',
  component: UnitAddComponent,
  children: [
    {
      path: 'unit-add',
      component: UnitAddComponent,
    },
    {
      path: 'unit-edit',
      component: UnitAddComponent,
    },
    {
      path: 'unit-delete',
      component: UnitAddComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnitManagementRoutingModule { }
