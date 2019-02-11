import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimulationsFilesComponent } from './simulation-start/simulation-start.component';


const routes: Routes = [{
  path: '',
  component: SimulationsFilesComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SimulationResultsRoutingModule { }
