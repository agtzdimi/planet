import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParamsSetupComponent } from './params-setup/params-setup.component';


const routes: Routes = [{
  path: '',
  component: ParamsSetupComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlobalParamsRoutingModule { }
