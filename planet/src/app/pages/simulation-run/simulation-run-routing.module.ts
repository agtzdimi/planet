import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimulationStartComponent } from './simulation-start/simulation-start.component';


const routes: Routes = [{
  path: '',
  component: SimulationStartComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimulationRunRoutingModule { }
